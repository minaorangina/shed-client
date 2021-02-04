import { Component } from 'react'
import CardDisplay, { SingleCard } from './CardDisplay'
import cardStyles from './CardDisplay.module.css'
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
}

interface GameTableProps {
  gameState: GameState,
  sendReply: Function,
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

    switch(gameState.command) {
      case Protocol.Reorg:
        return {
          selectableHand: [0,1,2],
          selectableSeen: [0,1,2],
          min: 3,
          max: 3,
        }

      case Protocol.PlayHand:
        return {
          selectableHand: gameState.moves,
          selectableSeen: [],
          min: 1,
          max: gameState.moves.length,
        }

      default:
        return null
    }
  }

  toggleSelection = (type: string, selection: Card) => {
    console.log("clicked", selection)
    let newSelected;
    const idx = this.state.selected.indexOf(selection)

    if (idx === -1) {
      const maxCardsSelected = this.state.selected.length === this.state.max;
      if (maxCardsSelected) {
        return;
      }
      newSelected = [...this.state.selected, selection].sort()
    } else {
      newSelected = this.state.selected.filter(v => v !== selection);
    }

    console.log("new", newSelected)

    this.setState({
      selected: newSelected,
    })
  }

  handleSubmit = () => {
    const { gameState } = this.props;
    let decision: number[] = []

    if (gameState.command === Protocol.Reorg) {
      // map cards to server index
      decision = this.state.selected.map((card: Card): number => {
        let idx = gameState.hand.indexOf(card);

        if (idx === -1) {
          idx = gameState.seen.indexOf(card) + REORG_SEEN_OFFSET;
        }

        return idx
      })
    }

    const reply: Reply = {
      player_id: "",
      command: gameState.command,
      decision: decision.sort(),
    }
    
    this.props.sendReply(reply);
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
                        <div className={styles.opponent}>
                          <p>{`${o.player_id}'s visible cards`}</p>
                          {
                            o.seen.map((c: Card) => (
                              <SingleCard
                                key={c.canonicalName}
                                card={c} handleClick={()=>{}}
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
