import { Component } from 'react'
import './App.css';
import Welcome from './Welcome';
import GameRoom from './GameRoom';
import { GameState, Message, Card } from './types';

type AppState = {
  game_id: string,
  player_id: string,
  name: string,
  is_admin: boolean,
  ws: WebSocket|null,
  started: boolean,
  players: string[],
  gameState: GameState,
}

class App extends Component {
  state: AppState  = {
    game_id: "",
    player_id: "",
    name: "",
    is_admin: false,
    ws: null,
    started: false,
    players: [],
    gameState: {} as GameState,
  }

  updatePlayers = (...newPlayers: string[]) => {
    this.setState({
      players: [...this.state.players, ...newPlayers]
    })
  }

  updateGameData = (updates: any) => {
    delete updates.players
    this.setState({
      ...updates,
      players: this.state.players,
    }, () => {
      console.info("INITIAL DATA", this.state)
    })
  }

  initWS = () => {
    if (!this.state.ws) {
       if (!window.WebSocket) {
          console.error("Browser does not support websockets")
          return
        }

        const { game_id: gameID, player_id: playerID } = this.state

        const ws = new WebSocket(`ws://localhost:8000/ws?game_id=${gameID}&player_id=${playerID}`)

        ws.onopen = console.info

        ws.onerror = (e: any) => {
          throw new Error(`websocket error: ${e.error}`)
        };

        ws.onmessage = this.handleMessage

        this.setState({ ws })
    }
  }

  startGame = () => {
    this.state.ws && this.state.ws.send(JSON.stringify({
      player_id: this.state.player_id,
      command: 3, // Start game
    }))
  }

  handleReorg = (data: Message) => {
    this.setState({
      gameState: {
        command: data.command,
        shouldRespond: data.should_respond,
        currentTurn: data.current_turn,
        isTurn: data.current_turn === this.state.player_id,
        hand: data.hand,
        seen: data.seen,
        opponents: data.opponents,
      },
    })
  }

  handleMessage = (raw: MessageEvent) => {
    console.info("incoming")
    const data: Message = JSON.parse(raw.data)
    console.log(`command ${data.command}`)

    switch (data.command) {
      case 1: // new joiner
        console.log("NEW JOINER",data)
        this.updatePlayers(data!.joiner || "")
        break;

      case 2: // reorg
        console.log("REORG", data)
        this.handleReorg(data)
        break;

      case 4: // has started
        console.log("GAME HAS STARTED!")
        this.setState({
          started: true,
        })
        break;

      default:
        console.log("unknown command", data)
    }
  }

  render() {
    return (
      <div className="App">
        {
          this.state.game_id && 
            <GameRoom 
              gameID={this.state.game_id}
              isAdmin={this.state.is_admin}
              name={this.state.name}
              players={this.state.players}
              playerID={this.state.player_id}
              started={this.state.started}
              gameState={this.state.gameState}

              initWS={this.initWS}
              startGame={this.startGame}
              updatePlayers={this.updatePlayers}
            />
        }
        {
          !this.state.game_id && 
            <Welcome updateGameData={this.updateGameData} updatePlayers={this.updatePlayers} />
        }
      </div>
    );
  }
}

export default App