import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { 'TransactionFailed' : null } |
  { 'ZeroAddress' : null } |
  { 'InsufficientBalance' : null } |
  { 'InvalidTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : null };
export interface CostEstimate { 'total' : bigint, 'items' : Array<CostItem> }
export interface CostItem {
  'to' : Principal,
  'cost' : bigint,
  'description' : string,
}
export interface Event {
  'id' : bigint,
  'startTime' : [] | [bigint],
  'owner' : Principal,
  'data' : Array<number>,
  'name' : string,
  'description' : [] | [string],
  'totalSupply' : number,
  'imageUrl' : [] | [string],
  'remainingTickets' : number,
  'price' : bigint,
  'universeIds' : Array<TokenId>,
}
export interface EventMintingRequest {
  'startTime' : [] | [bigint],
  'data' : Array<number>,
  'name' : string,
  'description' : [] | [string],
  'totalSupply' : number,
  'imageUrl' : [] | [string],
  'price' : bigint,
  'universeIds' : Array<TokenId>,
}
export type MintingReceipt = { 'Ok' : MintingReceiptSuccess } |
  { 'Err' : ApiError };
export interface MintingReceiptSuccess {
  'id' : bigint,
  'universeTokenId' : [] | [TokenId],
  'eventTokenId' : [] | [TokenId],
  'transactions' : Array<CostItem>,
}
export interface MintingRequest {
  'universe' : [] | [UniverseMintingRequest],
  'event' : [] | [EventMintingRequest],
}
export type QueryError = { 'NotFound' : null } |
  { 'Other' : null };
export type Result = { 'Ok' : Universe } |
  { 'Err' : QueryError };
export type Result_1 = { 'Ok' : Event } |
  { 'Err' : QueryError };
export type Result_2 = { 'Ok' : CostEstimate } |
  { 'Err' : ApiError };
export type TokenId = bigint;
export interface Universe {
  'id' : TokenId,
  'owner' : Principal,
  'name' : string,
  'tags' : Array<string>,
  'description' : [] | [string],
  'imageUrl' : [] | [string],
  'availableUsageTerms' : Array<UsageTerms>,
}
export interface UniverseMintingRequest {
  'name' : string,
  'tags' : Array<string>,
  'description' : [] | [string],
  'imageUrl' : [] | [string],
  'availableUsageTerms' : Array<UsageTerms>,
}
export interface UsageTerms {
  'royaltyFee' : number,
  'fixedFee' : bigint,
  'attribution' : boolean,
}
export interface _SERVICE {
  'estimateMintingCost' : ActorMethod<[MintingRequest], Result_2>,
  'getEvent' : ActorMethod<[TokenId], Result_1>,
  'getEvents' : ActorMethod<[], Array<Event>>,
  'getUniverse' : ActorMethod<[TokenId], Result>,
  'getUniverses' : ActorMethod<[], Array<Universe>>,
  'mint' : ActorMethod<[MintingRequest], MintingReceipt>,
  'totalEvents' : ActorMethod<[], bigint>,
}
