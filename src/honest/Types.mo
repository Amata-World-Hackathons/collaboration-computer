import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";

module {
    public type List<T> = ?(T, List<T>);
    public type TokenId = Nat64;
    public type TransactionId = Nat;

    public type MintingRequest = {
        event: ?EventMintingRequest;
        universe: ?UniverseMintingRequest;
    };

    public type EventMintingRequest = {
        name: Text;
        data: Blob;
        price: Nat64;
        imageUrl: ?Text;
        startTime: ?Nat64;
        description: ?Text;
        totalSupply: Nat32;
        universeIds: [TokenId];
    };

    public type UniverseMintingRequest = {
        name: Text;
        tags: [Text];
        imageUrl: ?Text;
        description: ?Text;
        availableUsageTerms: [UsageTerms];
    };

    public type CostItem = {
        to: Principal;
        cost: Nat64;
        description: Text;
    };

    public type CostEstimate = {
        items: [CostItem];
        total: Nat64;
    };

    public type Event = {
        id: Nat64;
        name: Text;
        data: Blob;
        owner: Principal;
        price: Nat64;
        imageUrl: ?Text;
        startTime: ?Nat64;
        description: ?Text;
        totalSupply: Nat32;
        universeIds: [TokenId];
        remainingTickets: Nat32;
    };

    public type TicketNFT = {
        owner: Principal;
    };

    public type UsageTerms = {
        fixedFee: Nat64;
        royaltyFee: Nat32;
        attribution: Bool;
    };

    public type EventStorage = {
        id: Nat64;
        name: Text;
        data: Blob;
        owner: Principal;
        price: Nat64;
        tickets: List<TicketNFT>;
        imageUrl: ?Text;
        startTime: ?Nat64;
        description: ?Text;
        totalSupply: Nat32;
        universeIds: [TokenId];
    };

    public type Universe = {
        id: TokenId;
        name: Text;
        tags: [Text];
        owner: Principal;
        imageUrl: ?Text;
        description: ?Text;
        availableUsageTerms: [UsageTerms];
    };

    public type Result<S, E> = {
        #Ok: S;
        #Err: E;
    };

    public type ApiError = {
        #Unauthorized;
        #InvalidTokenId;
        #InsufficientBalance;
        #TransactionFailed;
        #ZeroAddress;
        #Other;
    };

    public type QueryError = {
        #NotFound;
        #Other;
    };

    public type MintingReceipt = Result<MintingReceiptSuccess, ApiError>;

    public type MintingReceiptSuccess = {
        id: Nat;
        eventTokenId: ?TokenId;
        universeTokenId: ?TokenId;
        transactions: [CostItem];
    };
}