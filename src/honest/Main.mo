import Ledger "canister:ledger";

import Principal "mo:base/Principal";
import List "mo:base/List";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Types "./Types";
import Account "./Account";

actor Honest {
    stable var events = List.nil<Types.EventStorage>();
    stable var universes = List.nil<Types.Universe>();
    stable var transactionId: Types.TransactionId = 0;

    let icp_fee: Nat = 10_000;
    let fixedMintingFee: Nat = 10_000 + icp_fee;

    // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
    let null_address : Principal = Principal.fromText("aaaaa-aa");

    func myAccountId() : Account.AccountIdentifier {
        Account.accountIdentifier(Principal.fromActor(Honest), Account.defaultSubaccount())
    };

    public query func totalEvents() : async Nat64 {
        return Nat64.fromNat(List.size(events));
    };

    public query func getEvents() : async [Types.Event] {
        let mapped = List.map(events, func (item: Types.EventStorage) : Types.Event {
            return eventFromStorage(item);
        });

        return List.toArray(mapped);
    };

    public query func getEvent(tokenId: Types.TokenId) : async Types.Result<Types.Event, Types.QueryError> {
        let item = List.find(events, func(ev: Types.EventStorage) : Bool { ev.id == tokenId });

        switch (item) {
            case null {
                return #Err(#NotFound);
            };

            case (?event) {
                return #Ok(eventFromStorage(event));
            };
        };
    };

    public query func getUniverses() : async [Types.Universe] {
        return List.toArray(universes);
    };

    public query func getUniverse(tokenId: Types.TokenId) : async Types.Result<Types.Universe, Types.QueryError> {
        let item = List.find(universes, func(uni: Types.Universe) : Bool { uni.id == tokenId });

        switch (item) {
            case null {
                return #Err(#NotFound);
            };

            case (?universe) {
                return #Ok(universe);
            };
        };
    };


    func syncGetUniverse(tokenId: Types.TokenId) : Types.Result<Types.Universe, Types.QueryError> {
        let item = List.find(universes, func(uni: Types.Universe) : Bool { uni.id == tokenId });

        switch (item) {
            case null {
                return #Err(#NotFound);
            };

            case (?universe) {
                return #Ok(universe);
            };
        };
    };

    func eventFromStorage(storedEvent: Types.EventStorage) : Types.Event {
        return {
            id = storedEvent.id;
            data = storedEvent.data;
            name = storedEvent.name;
            owner = storedEvent.owner;
            price = storedEvent.price;
            imageUrl = storedEvent.imageUrl;
            startTime = storedEvent.startTime;
            description = storedEvent.description;
            totalSupply = storedEvent.totalSupply;
            universeIds = storedEvent.universeIds;
            remainingTickets = storedEvent.totalSupply - Nat32.fromNat(List.size(storedEvent.tickets));
        };
    };

    public query func estimateMintingCost(request: Types.MintingRequest) : async Types.Result<Types.CostEstimate, Types.ApiError> {
        var costs = List.nil<Types.CostItem>();
        var total : Nat64 = 0;

        switch (request.event) {
            case null {};

            case (?event) {
                for (id in event.universeIds.vals()) {
                    let universeResult = syncGetUniverse(id);

                    switch (universeResult) {
                        case (#Err(_)) {
                            return #Err(#Unauthorized);
                        };

                        case (#Ok(universe)) {
                            switch (List.last(List.fromArray(universe.availableUsageTerms))) {
                                case null {
                                    return #Err(#Unauthorized);
                                };

                                case (?usageTerms) {
                                    if (usageTerms.fixedFee > 0) {
                                        costs := List.push({
                                            to = universe.owner;
                                            cost = usageTerms.fixedFee;
                                            description = "Connection fee for " # universe.name;
                                        }, costs);
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };

        if (Option.isSome(request.event) or Option.isSome(request.universe)) {
            costs := List.push({
                to = Principal.fromActor(Honest);
                cost = Nat64.fromNat(fixedMintingFee);
                description = "Fixed platform fee";
            }, costs);
            total := total + Nat64.fromNat(fixedMintingFee);
        };

        return #Ok({
            items = List.toArray(costs);
            total = total;
        });
    };

    public shared query ({ caller }) func getPaymentAccountId() : async Account.AccountIdentifier {
        getPaymentAccountIdFor(caller)
    };

    func getPaymentAccountIdFor(principal: Principal) : Account.AccountIdentifier {
        Account.accountIdentifier(Principal.fromActor(Honest), Account.principalToSubaccount(principal));
    };

    public shared({ caller }) func mint(request: Types.MintingRequest) : async Types.MintingReceipt {
        let holdingAccount = getPaymentAccountIdFor(caller);

        let heldBalance = await Ledger.account_balance({ account = holdingAccount });

        let estimatedCostResult = await estimateMintingCost(request);

        switch (estimatedCostResult) {
            case (#Err(_)) {
                return #Err(#Unauthorized);
            };

            case (#Ok(estimatedCost)) {
                // if (heldBalance.e8s < estimatedCost.total) {
                //     return #Err(#InsufficientBalance);
                // };

                var eventId : ?Types.TokenId = null;
                let owner = caller;

                switch (request.event) {
                    case null { };

                    case (?eventRequest) {
                        eventId := ?Nat64.fromNat(List.size(events));
                        let event : Types.EventStorage = {
                            id = Option.get(eventId, Nat64.fromNat(0));
                            data = eventRequest.data;
                            name = eventRequest.name;
                            owner = owner;
                            price = eventRequest.price;
                            tickets = List.nil<Types.TicketNFT>();
                            imageUrl = eventRequest.imageUrl;
                            startTime = eventRequest.startTime;
                            description = eventRequest.description;
                            totalSupply = eventRequest.totalSupply;
                            universeIds = eventRequest.universeIds;
                        };

                        events := List.push(event, events);
                    };
                };

                var universeId : ?Types.TokenId = null;

                switch (request.universe) {
                    case null { };

                    case (?universeRequest) {
                        universeId := ?Nat64.fromNat(List.size(universes));
                        let universe : Types.Universe = {
                            id = Option.get(universeId, Nat64.fromNat(0));
                            name = universeRequest.name;
                            tags = universeRequest.tags;
                            owner = owner;
                            imageUrl = universeRequest.imageUrl;
                            description = universeRequest.description;
                            availableUsageTerms = universeRequest.availableUsageTerms;
                        };

                        universes := List.push(universe, universes);
                    };
                };

                // for (item in estimatedCost.items.vals()) {
                //     transactionId += 1;
                //     let res = await Ledger.transfer({
                //         memo = Nat64.fromNat(transactionId);
                //         from_subaccount = ?Account.principalToSubaccount(caller);
                //         to = Account.accountIdentifier(item.to, Account.defaultSubaccount());
                //         amount = { e8s = item.cost - Nat64.fromNat(icp_fee) };
                //         fee = { e8s = Nat64.fromNat(icp_fee) };
                //         created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
                //     });

                //     switch res {
                //         case (#Err e) {
                //             return #Err(#TransactionFailed);
                //         };

                //         case _ {};
                //     };
                // };

                // TODO refund remaining balance to the caller?

                return #Ok({
                    id = transactionId;
                    eventTokenId = eventId;
                    universeTokenId = universeId;
                    transactions = estimatedCost.items;
                });
            };
        };

    };
}