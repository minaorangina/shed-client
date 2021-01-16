import { Component } from 'react'
import './App.css';
import Welcome from './Welcome';
import GameRoom from './GameRoom';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      game_id: undefined,
      player_id: undefined,
      name: undefined,
      is_admin: undefined,
      ws: undefined,
      started: false,
      players: [],
    }
  }

  updatePlayers = (...newPlayers) => {
    this.setState({
      players: [...this.state.players, ...newPlayers]
    })
  }

  updateGameData = (updates) => {
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

        ws.onerror = e => {
          throw new Error(`websocket error: ${e.error}`)
        };

        ws.onmessage = this.handleMessage

        this.setState({ ws })
    }
  }

  startGame = () => {
    this.state.ws.send(JSON.stringify({
      player_id: this.state.player_id,
      command: "Start"
    }))
  }

  handleMessage = (raw) => {
    console.info("incoming", raw)
    const data = JSON.parse(raw.data)

    switch (data.command) {
      case 1: // new joiner
        console.log("NEW JOINER",data)
        this.updatePlayers(data.joiner)

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