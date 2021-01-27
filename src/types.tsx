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
}

export interface Opponent {
  player_id: string,
  name: string,
  seen: Card[],
}

export interface Message {
  command: number,
  player_id: string,
  name: string,
  message: string,
  should_respond: boolean,
  hand: Card[],
  seen: Card[],
  pile: Card[],
  joiner?: string,
  current_turn?: string,
  moves?: number[],
  opponents: Opponent[]
  finished_players?: string[]
  error?: string,
}

export interface GameState {
  command: number,
  shouldRespond: boolean,
  currentTurn: string,
  hand: Card[],
  seen: Card[],
  pile: Card[],
  opponents: Opponent[]
}
