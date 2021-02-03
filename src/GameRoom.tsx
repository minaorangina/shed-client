import { Component } from 'react'
import GameTable from './GameTable'
import { GameState } from './types'

class GameRoom extends Component<GameRoomProps> {
  constructor(props: GameRoomProps) {
    super(props)
  }

  async componentDidMount() {
    this.props.initWS()
  }

  render() {
    return (
      <>
      {
        this.props.started && <GameTable gameState={this.props.gameState} sendReply={this.props.sendReply} />
      }
      {
        !this.props.started &&  
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
        props.players.map((name) => <li key={name}>{name}</li>)
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
  players: string[],
  started: boolean,
  playerID: string,
  gameState: GameState,
  initWS: Function,
  sendReply: Function,
  startGame: Function,
}

interface WaitingRoomProps {
  gameID: string,
  isAdmin: boolean,
  name: string,
  players: string[],
  startGame: Function,
}

interface StartButtonProps {
  startGame: Function,
}
