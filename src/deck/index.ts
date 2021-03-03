import { Deck } from '../types'

import aceOfClubs from './ace_of_clubs.svg'
import twoOfClubs from './2_of_clubs.svg'
import threeOfClubs from './3_of_clubs.svg'
import fourOfClubs from './4_of_clubs.svg'
import fiveOfClubs from './5_of_clubs.svg'
import sixOfClubs from './6_of_clubs.svg'
import sevenOfClubs from './7_of_clubs.svg'
import eightOfClubs from './8_of_clubs.svg'
import nineOfClubs from './9_of_clubs.svg'
import tenOfClubs from './10_of_clubs.svg'
import jackOfClubs from './jack_of_clubs.svg'
import queenOfClubs from './queen_of_clubs.svg'
import kingOfClubs from './king_of_clubs.svg'

import aceOfDiamonds from './ace_of_diamonds.svg'
import twoOfDiamonds from './2_of_diamonds.svg'
import threeOfDiamonds from './3_of_diamonds.svg'
import fourOfDiamonds from './4_of_diamonds.svg'
import fiveOfDiamonds from './5_of_diamonds.svg'
import sixOfDiamonds from './6_of_diamonds.svg'
import sevenOfDiamonds from './7_of_diamonds.svg'
import eightOfDiamonds from './8_of_diamonds.svg'
import nineOfDiamonds from './9_of_diamonds.svg'
import tenOfDiamonds from './10_of_diamonds.svg'
import jackOfDiamonds from './jack_of_diamonds.svg'
import queenOfDiamonds from './queen_of_diamonds.svg'
import kingOfDiamonds from './king_of_diamonds.svg'

import aceOfHearts from './ace_of_hearts.svg'
import twoOfHearts from './2_of_hearts.svg'
import threeOfHearts from './3_of_hearts.svg'
import fourOfHearts from './4_of_hearts.svg'
import fiveOfHearts from './5_of_hearts.svg'
import sixOfHearts from './6_of_hearts.svg'
import sevenOfHearts from './7_of_hearts.svg'
import eightOfHearts from './8_of_hearts.svg'
import nineOfHearts from './9_of_hearts.svg'
import tenOfHearts from './10_of_hearts.svg'
import jackOfHearts from './jack_of_hearts.svg'
import queenOfHearts from './queen_of_hearts.svg'
import kingOfHearts from './king_of_hearts.svg'

import aceOfSpades from './ace_of_spades.svg'
import twoOfSpades from './2_of_spades.svg'
import threeOfSpades from './3_of_spades.svg'
import fourOfSpades from './4_of_spades.svg'
import fiveOfSpades from './5_of_spades.svg'
import sixOfSpades from './6_of_spades.svg'
import sevenOfSpades from './7_of_spades.svg'
import eightOfSpades from './8_of_spades.svg'
import nineOfSpades from './9_of_spades.svg'
import tenOfSpades from './10_of_spades.svg'
import jackOfSpades from './jack_of_spades.svg'
import queenOfSpades from './queen_of_spades.svg'
import kingOfSpades from './king_of_hearts.svg'

import nullCard from './null-card.svg'


const deck: Deck = {
  NullSuit: {
    NullRank: nullCard,
  },
  Clubs: {
    Ace: aceOfClubs,
    Two: twoOfClubs,
    Three: threeOfClubs,
    Four: fourOfClubs,
    Five: fiveOfClubs,
    Six: sixOfClubs,
    Seven: sevenOfClubs,
    Eight: eightOfClubs,
    Nine: nineOfClubs,
    Ten: tenOfClubs,
    Jack: jackOfClubs,
    Queen: queenOfClubs,
    King: kingOfClubs,
  },
  Diamonds: {
    Ace: aceOfDiamonds,
    Two: twoOfDiamonds,
    Three: threeOfDiamonds,
    Four: fourOfDiamonds,
    Five: fiveOfDiamonds,
    Six: sixOfDiamonds,
    Seven: sevenOfDiamonds,
    Eight: eightOfDiamonds,
    Nine: nineOfDiamonds,
    Ten: tenOfDiamonds,
    Jack: jackOfDiamonds,
    Queen: queenOfDiamonds,
    King: kingOfDiamonds,
  },
  Hearts: {
    Ace: aceOfHearts,
    Two: twoOfHearts,
    Three: threeOfHearts,
    Four: fourOfHearts,
    Five: fiveOfHearts,
    Six: sixOfHearts,
    Seven: sevenOfHearts,
    Eight: eightOfHearts,
    Nine: nineOfHearts,
    Ten: tenOfHearts,
    Jack: jackOfHearts,
    Queen: queenOfHearts,
    King: kingOfHearts,
  },
  Spades: {
    Ace: aceOfSpades,
    Two: twoOfSpades,
    Three: threeOfSpades,
    Four: fourOfSpades,
    Five: fiveOfSpades,
    Six: sixOfSpades,
    Seven: sevenOfSpades,
    Eight: eightOfSpades,
    Nine: nineOfSpades,
    Ten: tenOfSpades,
    Jack: jackOfSpades,
    Queen: queenOfSpades,
    King: kingOfSpades,
  },
}

export default deck