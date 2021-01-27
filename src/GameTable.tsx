import { GameState, Card } from './types'
import deck from './deck'

function GameTable(props: GameTableProps) {
    return (
      <>
      <h1>Game table!</h1>
        {
          !props.gameState && <p>Waiting for server...</p>
        }
        {
          props.gameState.hand && (
            <>
              <h2>Hand cards</h2>
              <CardDisplay cards={props.gameState.hand} type="hand" />
            </>
          )
        }
        {
          props.gameState.seen && (
            <>
              <h2>Visible cards</h2>
              <CardDisplay cards={props.gameState.seen} type="seen" />
            </>
          )
        }
        {
          <h2>Hidden cards</h2>
        }
     </>
    )
}

export default GameTable

interface GameTableProps {
  gameState: GameState,
}

function CardDisplay(props: CardDisplayProps) {
  return (
     <div className="cards">
      {
        props.cards && props.cards.map((c: Card) => {
          const canonicalName = `${c.rank} of ${c.suit}`
          return (
            <img key={canonicalName} src={deck[c.suit][c.rank]} alt={canonicalName} />
          )
        })
      }
      </div>
  )
}

interface CardDisplayProps {
  cards: Card[],
  type: string,
}

// <img src={deck[c.suit][c.rank]} alt={canonicalName} />