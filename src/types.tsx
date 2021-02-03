export enum Protocol {
  Null = 0,
  NewJoiner = 1,
  Reorg = 2,
  Start = 3,
  HasStarted =4,
  Error = 5,
  // combining game-specific and internal protocol messages.
  // will split later if necessary
  PlayHand = 6,      // when a player plays cards from their hand
  PlaySeen = 7,      // when a player plays cards from their seen cards
  PlayUnseen = 8,   // when a player plays cards from their unseen cards
  ReplenishHand = 9, // might disappear if EndOfTurn is better
  Turn = 10,
  EndOfTurn = 11,
  SkipTurn = 12,
  Burn = 13,
  UnseenSuccess = 14,
  UnseenFailure = 15,
  PlayerFinished = 16,
  GameOver = 17,
}

export enum Rank {
  Ace = "Ace",
  Two = "Two",
  Three = "Three",
  Four = "Four",
  Five = "Five",
  Six = "Six",
  Seven = "Seven",
  Eight = "Eight",
  Nine = "Nine",
  Ten = "Ten",
  Jack = "Jack",
  Queen = "Queen",
  King = "King",
}

export enum Suit {
  Clubs = "Clubs",
  Diamonds = "Diamonds",
  Hearts = "Hearts",
  Spades = "Spades",
}

export interface Card {
  rank: Rank,
  suit: Suit,
  canonicalName: string,
}

export interface Opponent {
  player_id: string,
  name: string,
  seen: Card[],
}

export interface Message {
  command: Protocol,
  player_id: string,
  name: string,
  message: string,
  should_respond: boolean,
  hand: Card[],
  seen: Card[],
  pile: Card[],
  opponents: Opponent[]
  current_turn?: string,
  moves?: number[],
  finished_players?: string[]
  error?: string,
  joiner?: string,
}

export interface PendingGame {
  player_id: string,
  name: string,
  is_admin: boolean,
}

export interface PendingGameJoined extends PendingGame {
  players: string[],
}

export interface Reply {
  player_id: string,
  command: Protocol,
  decision: number[],
}

export interface GameState {
  command: Protocol,
  shouldRespond: boolean,
  hand: Card[],
  seen: Card[],
  pile: Card[],
  currentTurn: string,
  isTurn: boolean,
  moves: number[],
  opponents: Opponent[]
}

export enum CardGroup {
  hand = "hand",
  seen = "seen",
  unseen = "unseen",
}
