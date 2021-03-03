import { Component } from 'react'
import CardDisplay, { SingleCard } from './CardDisplay'
import Pile from './Pile'
import styles from './GameTable.module.css'
import { GameTableProps, Protocol, CardGroup, Card, Reply, Opponent, REORG_SEEN_OFFSET } from './types'
interface GameTableState {
  selected: Card[],
}
class GameTable extends Component<GameTableProps>{
  constructor(props: GameTableProps) {
    super(props);
  }

  state: GameTableState = {
    selected: [],
  }

  toggleSelection = (type: CardGroup, selection: Card) => {
    console.log("clicked", selection)

    const idx = this.state.selected.indexOf(selection)
    // deselecting a card
    if (idx > -1) {
      this.setState({
        selected: this.state.selected.filter(v => v !== selection),
      }, () => {
        console.log("after selection of card", this.state)
      })
      return
    }

    // selecting a card
    if (this.state.selected.length === 0) {
      this.setState({
        selected: [selection],
      })
      return;
    }

    if (this.props.command === Protocol.Reorg) {
      if (this.state.selected.length < this.props.max) {
        this.setState({
          selected: [...this.state.selected, selection].sort(),
        })
        return
      }
    }

    // Can only select more than one card if they are of the same rank
    const isSameRank = this.state.selected.every((c: Card) => {
      return c.rank === selection.rank
    })

    if (isSameRank) {
      this.setState({
        selected: [...this.state.selected, selection],
      })
      return
    }

    // tried to add an illegal card
    console.log("oh no")
  }

  handleSubmit = () => {
    let decision: number[] = []

    if (this.state.selected.length < this.props.min || this.state.selected.length > this.props.max) {
      return
    }

    if (this.props.command === Protocol.Reorg) {
      let hand = [...this.state.selected]
      let seen: Card[] = []

      // map cards to server index
      decision = this.state.selected.map((card: Card): number => {
        let idx = this.props.hand.indexOf(card);

        if (idx === -1) {
          const seenIdx = this.props.seen.indexOf(card)
          idx = seenIdx + REORG_SEEN_OFFSET;
        }

        return idx
      })

      // grab the leftover cards, maintaining their ordering
      for (let i = 0; i < 6; i++) {
        if (!decision.includes(i)) {
          seen.push(this.props.reorgSet[i])
        }
      }

      // show the new selection
      console.log("hand", hand, "seen", seen)
      this.props.partiallyUpdateGameState({ hand, seen })
      this.setState({ selected: [], reorgSet: {} })

      const reply: Reply = {
        playerID: "", // handled in App
        command: this.props.command,
        decision: decision.sort(),
      }

      this.props.sendReply(reply);
    }

    if (this.props.command === Protocol.PlayHand) {
      const decision = this.state.selected.map((card: Card) => {
        return this.props.hand.indexOf(card)
      })

      const reply: Reply = {
        playerID: "", // handled in App
        command: this.props.command,
        decision,
      }

      this.props.sendReply(reply);
      this.setState({ selected: [] })
    }

    if (this.props.command === Protocol.PlaySeen) {
      const decision = this.state.selected.map((card: Card) => {
        return this.props.seen.indexOf(card)
      })

      const reply: Reply = {
        playerID: "", // handled in App
        command: this.props.command,
        decision,
      }

      this.props.sendReply(reply);
      this.setState({ selected: [] })
    }

    if (this.props.command === Protocol.PlayUnseen) {
      const decision = this.state.selected.map((card: Card) => {
        return this.props.unseen.indexOf(card)
      })

      const reply: Reply = {
        playerID: "", // handled in App
        command: this.props.command,
        decision,
      }

      this.props.sendReply(reply);
      this.setState({ selected: [] })
    }
  }

  render() {
    const {
      message,
      deckCount,
      command,
      isTurn,
      min,
      max,
      hand,
      selectableHand,
      seen,
      selectableSeen,
      unseen,
      selectableUnseen,
      pile,
      opponents,
    } = this.props

    return (
      <>
        <h2>{message}</h2>
        <h3>Cards left in deck: {deckCount}</h3>

        <div className={styles.container}>
          <div className={styles.personalContainer}>
            {
              isTurn &&
              command !== Protocol.SkipTurn &&
              <button
                disabled={this.state.selected.length < min}
                onClick={this.handleSubmit}>
                  Confirm
              </button>
            }
            {
              <>
                <h2>Hand cards</h2>
                <CardDisplay
                  cards={hand}
                  selectable={selectableHand}
                  selected={this.state.selected}
                  toggleSelection={this.toggleSelection}
                  group={CardGroup.hand}
                />
              </>
            }
            {
              <>
                <h2>Visible cards</h2>
                <CardDisplay
                  cards={seen}
                  selectable={selectableSeen}
                  selected={this.state.selected}
                  toggleSelection={this.toggleSelection}
                  group={CardGroup.seen}
                />
              </>
            }
            {
              <>
              <h2>Hidden cards</h2>
                <CardDisplay
                  cards={unseen}
                  selectable={selectableUnseen}
                  selected={this.state.selected}
                  toggleSelection={this.toggleSelection}
                  group={CardGroup.unseen}
                />
              </>
            }
            </div>
            <div className={styles.sharedContainer}>
            {
              pile && <Pile cards={pile} />
            }
            {
              opponents && (
                <div className={styles.opponentsContainer}>
                  <h4>Opponents</h4>
                  {
                    opponents.map((o: Opponent) => {
                      return (
                        <div className={styles.opponent} key={o.playerID}>
                          <p>{`${o.name}'s visible cards`}</p>
                          {
                            o.seen.map((c: Card) => (
                              <SingleCard
                                key={c.canonicalName}
                                card={c} 
                                handleClick={()=>{}}
                                classes={styles.opponentCard}
                              />
                            ))
                          }
                        </div>
                      )
                    })
                  }
                </div>
              )
            }
          </div>
        </div>
      </>
    )
  }
}

export default GameTable
