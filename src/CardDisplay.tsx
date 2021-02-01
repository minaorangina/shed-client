import { Card, CardGroup } from './types'
import deck from './deck'
import styles from './CardDisplay.module.css'

function CardDisplay(props: CardDisplayProps) {
  return (
    <div className={styles.cardContainer}>
    {
      props.cards && props.cards.map((c: Card, i) => {
        const isSelected = props.selected.includes(c);

        const canonicalName = `${c.rank} of ${c.suit}`
        return (
          <img 
            key={canonicalName} 
            src={deck[c.suit][c.rank]} 
            alt={canonicalName}
            onClick={() => props.toggleSelection(props.group, c)}
            className={`${styles.card} ${isSelected ? `${styles.selected}` : ''}`}
          />
        )
      })
    }
    </div>
  )
}

export default CardDisplay

interface CardDisplayProps {
  cards: Card[],
  group: CardGroup,
  selectable: number[],
  selected: Card[],
  toggleSelection: Function,
}
