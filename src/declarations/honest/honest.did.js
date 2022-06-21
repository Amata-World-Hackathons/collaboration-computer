export const idlFactory = ({ IDL }) => {
  const UsageTerms = IDL.Record({
    'royaltyFee' : IDL.Nat32,
    'fixedFee' : IDL.Nat64,
    'attribution' : IDL.Bool,
  });
  const UniverseMintingRequest = IDL.Record({
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'imageUrl' : IDL.Opt(IDL.Text),
    'availableUsageTerms' : IDL.Vec(UsageTerms),
  });
  const TokenId = IDL.Nat64;
  const EventMintingRequest = IDL.Record({
    'startTime' : IDL.Opt(IDL.Nat64),
    'data' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'totalSupply' : IDL.Nat32,
    'imageUrl' : IDL.Opt(IDL.Text),
    'price' : IDL.Nat64,
    'universeIds' : IDL.Vec(TokenId),
  });
  const MintingRequest = IDL.Record({
    'universe' : IDL.Opt(UniverseMintingRequest),
    'event' : IDL.Opt(EventMintingRequest),
  });
  const CostItem = IDL.Record({
    'to' : IDL.Principal,
    'cost' : IDL.Nat64,
    'description' : IDL.Text,
  });
  const CostEstimate = IDL.Record({
    'total' : IDL.Nat64,
    'items' : IDL.Vec(CostItem),
  });
  const ApiError = IDL.Variant({
    'TransactionFailed' : IDL.Null,
    'ZeroAddress' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'Ok' : CostEstimate, 'Err' : ApiError });
  const Event = IDL.Record({
    'id' : IDL.Nat64,
    'startTime' : IDL.Opt(IDL.Nat64),
    'owner' : IDL.Principal,
    'data' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'totalSupply' : IDL.Nat32,
    'imageUrl' : IDL.Opt(IDL.Text),
    'remainingTickets' : IDL.Nat32,
    'price' : IDL.Nat64,
    'universeIds' : IDL.Vec(TokenId),
  });
  const QueryError = IDL.Variant({ 'NotFound' : IDL.Null, 'Other' : IDL.Null });
  const Result_1 = IDL.Variant({ 'Ok' : Event, 'Err' : QueryError });
  const Universe = IDL.Record({
    'id' : TokenId,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'imageUrl' : IDL.Opt(IDL.Text),
    'availableUsageTerms' : IDL.Vec(UsageTerms),
  });
  const Result = IDL.Variant({ 'Ok' : Universe, 'Err' : QueryError });
  const MintingReceiptSuccess = IDL.Record({
    'id' : IDL.Nat,
    'universeTokenId' : IDL.Opt(TokenId),
    'eventTokenId' : IDL.Opt(TokenId),
    'transactions' : IDL.Vec(CostItem),
  });
  const MintingReceipt = IDL.Variant({
    'Ok' : MintingReceiptSuccess,
    'Err' : ApiError,
  });
  return IDL.Service({
    'estimateMintingCost' : IDL.Func([MintingRequest], [Result_2], ['query']),
    'getEvent' : IDL.Func([TokenId], [Result_1], ['query']),
    'getEvents' : IDL.Func([], [IDL.Vec(Event)], ['query']),
    'getUniverse' : IDL.Func([TokenId], [Result], ['query']),
    'getUniverses' : IDL.Func([], [IDL.Vec(Universe)], ['query']),
    'mint' : IDL.Func([MintingRequest], [MintingReceipt], []),
    'totalEvents' : IDL.Func([], [IDL.Nat64], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
