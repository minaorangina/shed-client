import { Card } from './types'
import styles from './Pile.module.css'
import { SingleCard } from './CardDisplay'

function Pile(props: PileProps) {
  const { cards } = props
  const topCard = cards[0]
  return (
    <div className={styles.container}>
      <h2>Pile</h2>
      {
        props.cards.length === 0 ?
          <p>Pile is empty!</p> :
          <div className={styles.wrapper}>
            {
              <SingleCard
                classes={styles.topCard}
                card={topCard}
              />
            }
            <div className={styles.list}>
            {
              props.cards.slice(0, 8).map((c: Card, i) => {
                const cls = i === 0 ? styles.topCardText : ''
                return (
                  <div key={c.canonicalName}>
                    <p className={cls}>{c.canonicalName}</p>
                  </div>
                )
              })
            }
            </div>
        </div>
      }
    </div>
  )
}



export default Pile

interface PileProps {
  cards: Card[],
}