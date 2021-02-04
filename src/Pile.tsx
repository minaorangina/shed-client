import deck from './deck'
import { Card } from './types'
import styles from './Pile.module.css'

function Pile(props: PileProps) {
  return (
    <div className={styles.container}>
      <h4>Pile</h4>
      {
        props.cards.length === 0 && <p>Pile is empty!</p>
      }
      {
        props.cards.map((c: Card) => {
          return (
            <img
              key={c.canonicalName}
              alt={c.canonicalName}
              src={deck[c.suit][c.rank]}
            />
          )
        })
      }
    </div>
  )
}



export default Pile

interface PileProps {
  cards: Card[],
}