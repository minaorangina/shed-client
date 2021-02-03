import { Component } from 'react';
import CardDisplay from './CardDisplay'
import { GameState, Protocol, CardGroup, Card, Reply } from './types'

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
    if (!props.gameState.isTurn) {
      return {
        selectableHand: [],
        selectableSeen: [],
        selected: [],
        max: 0,
      }
    }

    switch(props.gameState.command) {
      case Protocol.Reorg:
        return {
          selectableHand: [0,1,2],
          selectableSeen: [0,1,2],
          min: 3,
          max: 3,
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
      <h1>Game table!</h1>
        {
          !gameState && <p>Waiting for server...</p>
        }
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
                group={CardGroup.hand} />
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
                group={CardGroup.seen} />
            </>
          )
        }
        {
          <h2>Hidden cards</h2>
        }
     </>
    )
  }
}

export default GameTable
