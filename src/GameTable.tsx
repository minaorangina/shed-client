import { Component } from 'react'
import CardDisplay, { SingleCard } from './CardDisplay'
import Pile from './Pile'
import styles from './GameTable.module.css'
import { GameState, Protocol, CardGroup, Card, Reply, Opponent } from './types'

const REORG_SEEN_OFFSET = 3

interface GameTableState {
  selectableHand: number[],
  selectableSeen: number[],
  selected: Card[],
  min: number,
  max: number,
  reorgSet: {[key: number]: Card},
}

interface GameTableProps {
  gameState: GameState,
  sendReply: Function,
  partiallyUpdateGameState: Function,
}

class GameTable extends Component<GameTableProps>{
  constructor(props: GameTableProps) {
    super(props);
  }

  state: GameTableState = {
    selectableHand: [],
    selectableSeen: [],
    selected: [],
    min: 0,
    max: 0,
    reorgSet: {},
  }

  static getDerivedStateFromProps(props: GameTableProps, state: GameTableState) {
    const { gameState } = props;
    if (!gameState.isTurn) {
      return {
        selectableHand: [],
        selectableSeen: [],
        selected: [],
        max: 0,
      }
    }

    if (state.selected.length > 0) {
      return null
    }

    switch(gameState.command) {
      case Protocol.Reorg:

        const reorgSet: {[key: number]: Card} = {}
        gameState.hand.forEach((c: Card, i) => {
          reorgSet[i] = c;
        })
         gameState.seen.forEach((c: Card, i) => {
          reorgSet[i + REORG_SEEN_OFFSET] = c;
        })

        return {
          selectableHand: [0,1,2],
          selectableSeen: [0,1,2],
          min: 3,
          max: 3,
          reorgSet,
        }
      
      case Protocol.PlayHand:
        // get max
        return {
          selectableHand: gameState.moves,
          selectableSeen: [],
          selected: [],
          min: 1,
          max: gameState.hand.length, // this could be more than 1 if cards have the same value.
        }

      default:
        return null
    }
  }

  toggleSelection = (type: string, selection: Card) => {
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

    if (this.props.gameState.command === Protocol.Reorg) {
      if (this.state.selected.length < this.state.max) {
        this.setState({
          selected: [...this.state.selected, selection].sort(),
        })
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
    const { gameState } = this.props;
    let decision: number[] = []

    if (this.state.selected.length < this.state.min || this.state.selected.length > this.state.max) {
      return
    }

    if (gameState.command === Protocol.Reorg) {
      let hand = [...this.state.selected]
      let seen: Card[] = []

      // map cards to server index
      decision = this.state.selected.map((card: Card): number => {
        let idx = gameState.hand.indexOf(card);

        if (idx === -1) {
          const seenIdx = gameState.seen.indexOf(card)
          idx = seenIdx + REORG_SEEN_OFFSET;
        }

        return idx
      })

      // grab the leftover cards, maintaining their ordering
      for (let i = 0; i < 6; i++) {
        if (!decision.includes(i)) {
          seen.push(this.state.reorgSet[i])
        }
      }

      // show the new selection
      console.log("hand", hand, "seen", seen)
      this.props.partiallyUpdateGameState({ hand, seen })
      this.setState({ selected: [], reorgSet: {} })

      const reply: Reply = {
        playerID: "", // handled in App
        command: gameState.command,
        decision: decision.sort(),
      }

      this.props.sendReply(reply);
    }

    if (gameState.command === Protocol.PlayHand) {
      const decision = this.state.selected.map((card: Card) => {
        return gameState.hand.indexOf(card)
      })

      const reply: Reply = {
        playerID: "", // handled in App
        command: gameState.command,
        decision,
      }

      this.props.sendReply(reply);
      this.setState({ selected: [] })
    }
  }

  render() {
    const { gameState } = this.props
    return (
      <>
        {
          !gameState && <p>Waiting for server...</p>
        }
        {
          gameState.message && <h2>{gameState.message}</h2>
        }
        <div className={styles.container}>
          <div className={styles.personalContainer}>
            {
              gameState.isTurn &&
              gameState.command !== Protocol.SkipTurn &&
              <button
                disabled={this.state.selected.length < this.state.min}
                onClick={this.handleSubmit}>
                  Confirm
              </button>
            }
            {
              gameState.hand && (
                <>
                  <h2>Hand cards</h2>
                  <CardDisplay
                    cards={gameState.hand}
                    selectable={this.state.selectableHand}
                    selected={this.state.selected}
                    toggleSelection={this.toggleSelection}
                    group={CardGroup.hand}
                  />
                </>
              )
            }
            {
              gameState.seen && (
                <>
                  <h2>Visible cards</h2>
                  <CardDisplay
                    cards={gameState.seen}
                    selectable={this.state.selectableSeen}
                    selected={this.state.selected}
                    toggleSelection={this.toggleSelection}
                    group={CardGroup.seen}
                  />
                </>
              )
            }
            {
              <h2>Hidden cards</h2>
            }
            </div>
            <div className={styles.sharedContainer}>
            {
              gameState.pile && <Pile cards={gameState.pile} />
            }
            {
              gameState.opponents && (
                <div className={styles.opponentsContainer}>
                  <h4>Opponents</h4>
                  {
                    gameState.opponents.map((o: Opponent) => {
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
