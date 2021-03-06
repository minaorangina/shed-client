import { Card, CardGroup } from './types'
import deck from './deck'
import styles from './CardDisplay.module.css'

function CardDisplay(props: CardDisplayProps) {
  return (
    <div className={styles.cardContainer}>
    {
      props.cards && props.cards.map((c: Card, i) => {
        const isSelected = props.selected.includes(c);
        const isSelectable = props.selectable.includes(i);
        const classes = `${isSelected ? `${styles.selected}` : ''} ${!isSelectable ? `${styles.disabled}` : ''}`
        return (
          <SingleCard
            key={c.canonicalName}
            card={c}
            handleClick={() => {
              if (isSelectable) {
                props.toggleSelection(props.group, c)
              }
            }}
            classes={classes}
          />
        )
      })
    }
    </div>
  )
}

export function SingleCard(props: SingleCardProps) {
  const { card, classes = "", handleClick } = props
  const fn = handleClick ? handleClick : (()=>{})
  const CardSvg = deck[card.suit][card.rank]

  return (
    <img
      src={deck[card.suit][card.rank]}
      alt={card.canonicalName}
      onClick={() => fn()}
      className={`${styles.card} ${classes}`}
    />
  )
}

export default CardDisplay

interface SingleCardProps {
  card: Card,
  classes?: string,
  handleClick?: Function,
}
interface CardDisplayProps {
  cards: Card[],
  group: CardGroup,
  selectable: number[],
  selected: Card[],
  toggleSelection: Function,
}
