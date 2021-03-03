import { Component } from 'react'
import GameTable from './GameTable'
import { GameState, GameTableProps, PlayerInfo, Protocol, Card, REORG_SEEN_OFFSET } from './types'

class GameRoom extends Component<GameRoomProps> {
  constructor(props: GameRoomProps) {
    super(props)
  }

  async componentDidMount() {
    this.props.initWS()
  }

  render() {
    console.log("hello?", this.props)

    return (
      <>
      {
        this.props.started &&
          <GameTable
            {
              ...mapStateToGameTableProps(
                this.props.gameState,
                this.props.sendReply,
                this.props.partiallyUpdateGameState,
              )
            }
          />
      }
      {
        (!this.props.started || Object.keys(this.props.gameState).length === 0) &&
          <WaitingRoom 
            gameID={this.props.gameID}
            isAdmin={this.props.isAdmin}
            name={this.props.name}
            players={this.props.players}

            startGame={this.props.startGame}
          />
      }
      </>
    )
  }
}

export default GameRoom


function WaitingRoom(props: WaitingRoomProps) {
  return (
    <>
      <h1>{`${props.name}, waiting for others to join`}</h1>
      {
        props.isAdmin && <>
          <StartButton startGame={props.startGame} />
          <h3>Game code</h3>
          <p>{props.gameID}</p>
        </>
      }
      <h2>Players</h2>
      <ul>
      {
        props.players.map((info: PlayerInfo) => <li key={info.name}>{info.name}</li>)
      }
      </ul>
    </>
  )
}

function StartButton(props: StartButtonProps) {
  return (
    <button 
      className="start-button"
      onClick={e => props.startGame(e)}
    >
      Start game
    </button>
  )
}

interface GameRoomProps {
  gameID: string,
  isAdmin: boolean,
  name: string,
  players: PlayerInfo[],
  started: boolean,
  playerID: string,
  gameState: GameState,
  initWS: Function,
  sendReply: Function,
  startGame: Function,
  partiallyUpdateGameState: Function,
}

interface WaitingRoomProps {
  gameID: string,
  isAdmin: boolean,
  name: string,
  players: PlayerInfo[],
  startGame: Function,
}

interface StartButtonProps {
  startGame: Function,
}

function mapStateToGameTableProps(
  gameState: GameState,
  sendReply: Function,
  partiallyUpdateGameState: Function,
): GameTableProps {

    const emptyState: GameTableProps = {
      command: gameState.command,
      isTurn: gameState.isTurn,
      hand: gameState.hand,
      seen: gameState.seen,
      // Hack to handle null Unseen cards
      unseen: gameState.unseen.map((c: Card, i: number) => {
        const newCard: Card = {...c, canonicalName: i.toString()}
        return newCard
      }),
      pile: gameState.pile,
      deckCount: gameState.deckCount,
      opponents: gameState.opponents,
      message: gameState.message,
      selectableHand: [],
      selectableSeen: [],
      selectableUnseen: [],
      selected: [],
      selectedUnseen: [],
      min: 0,
      max: 0,
      reorgSet: {},
      sendReply,
      partiallyUpdateGameState,
    }

    if (!gameState.isTurn) {
      return emptyState
    }

    if (gameState.command === Protocol.Reorg) {
      const reorgSet: {[key: number]: Card} = {}
      gameState.hand.forEach((c: Card, i) => {
        reorgSet[i] = c;
      })

      gameState.seen.forEach((c: Card, i) => {
        reorgSet[i + REORG_SEEN_OFFSET] = c;
      })

      console.log("am i here?")
      return {
        ...emptyState,
        selectableHand: [0,1,2],
        selectableSeen: [0,1,2],
        min: 3,
        max: 3,
        reorgSet,
      }
    }

    switch(gameState.command) {
      case Protocol.PlayHand:
        // get max
        return {
          ...emptyState,
          selectableHand: gameState.moves,
          min: 1,
          max: gameState.hand.length, // this could be more than 1 if cards have the same value.
        }

      case Protocol.PlaySeen:
        return {
          ...emptyState,
          selectableSeen: gameState.moves,
          min: 1,
          max: gameState.seen.length, // this could be more than 1 if cards have the same value.
        }

      case Protocol.PlayUnseen:
        return {
          ...emptyState,
          selectableUnseen: gameState.moves,
          min: 1,
          max: 1,
        }

      default:
        return emptyState
    }
}
