import { Component } from 'react';
import CardDisplay from './CardDisplay'
import { GameState, Protocol, CardGroup, Card } from './types'

interface GameTableState {
  selectableHand: number[],
  selectableSeen: number[],
  selected: Card[],
}

interface GameTableProps {
  gameState: GameState,
}

class GameTable extends Component<GameTableProps>{
  constructor(props: GameTableProps) {
    super(props);
  }

  state: GameTableState = {
    selectableHand: [],
    selectableSeen: [],
    selected: [],
  }

  static getDerivedStateFromProps(props: GameTableProps, state: GameTableState) {
    if (!props.gameState.isTurn) {
      return {
        selectableHand: [],
        selectableSeen: [],
      }
    }

    switch(props.gameState.command) {
      case Protocol.Reorg:
        return {
          selectableHand: [0,1,2],
          selectableSeen: [0,1,2],
        }

      default:
        return null
    }
  }

  handleSelection = (type: string, selection: Card) => {
    console.log("clicked", selection)
    const idx = this.state.selected.indexOf(selection)

    let newSelected = (idx === -1) ?
      [...this.state.selected, selection].sort() :
      this.state.selected.filter(v => v !== selection);

    console.log("new", newSelected)

    this.setState({
      selected: newSelected,
    })
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
          gameState.hand && (
            <>
              <h2>Hand cards</h2>
              <CardDisplay
                cards={gameState.hand}
                selectable={this.state.selectableHand}
                selected={this.state.selected}
                toggleSelection={this.handleSelection}
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
                toggleSelection={this.handleSelection}
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
