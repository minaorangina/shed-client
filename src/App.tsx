import { Component } from 'react'
import './App.css';
import Welcome from './Welcome';
import GameRoom from './GameRoom';
import { GameState, Message, Protocol, Reply, PlayerInfo } from './types';

type AppState = {
  gameID: string,
  playerID: string,
  name: string,
  isAdmin: boolean,
  ws: WebSocket|null,
  started: boolean,
  players: PlayerInfo[],
  gameState: GameState,
}

class App extends Component {
  state: AppState  = {
    gameID: "",
    playerID: "",
    name: "",
    isAdmin: false,
    ws: null,
    started: false,
    players: [],
    gameState: {} as GameState,
  }

  updateAppState = (updates: any) => {
    this.setState({
      ...updates,
    }, () => {
      console.info("INITIAL DATA", this.state)
    })
  }

  partiallyUpdateGameState = (updates: any) => {
    this.setState({
      gameState: {...this.state.gameState, ...updates},
    })
  }

  updateGameState = (data: Message) => {
    // console.log("update", data)
    const isTurn = data.command === Protocol.Reorg ||
      (data.currentTurn && data.currentTurn.playerID === this.state.playerID)

    this.setState({
      gameState: {
        command: data.command,
        shouldRespond: data.shouldRespond,
        currentTurn: data.currentTurn,
        isTurn,
        hand: data.hand,
        seen: data.seen,
        pile: data.pile.reverse(),
        opponents: data.opponents,
        moves: data.moves,
        finishedPlayers: data.finishedPlayers,
        error: data.error,
        message: data.message,
      },
    })
  }

  initWS = () => {
    if (!this.state.ws) {
       if (!window.WebSocket) {
          console.error("Browser does not support websockets")
          return
        }

        const { gameID , playerID } = this.state

        const ws = new WebSocket(`ws://localhost:8000/ws?gameID=${gameID}&playerID=${playerID}`)

        ws.onopen = console.info

        ws.onerror = (e: any) => {
          throw new Error(`websocket error: ${e}`)
        };

        ws.onmessage = this.handleMessage

        this.setState({ ws })
    }
  }

  startGame = () => {
    this.state.ws && this.state.ws.send(JSON.stringify({
      playerID: this.state.playerID,
      command: Protocol.Start,
    }))
  }


  sendReply = (reply: Reply) => {
    reply.playerID = this.state.playerID;
    this.state.ws && this.state.ws.send(JSON.stringify(reply))
  }

  handleMessage = (raw: MessageEvent) => {
    const data: Message = JSON.parse(raw.data)
    console.log(`incmoing command ${data.command}`)

    switch (data.command) {
      case Protocol.NewJoiner:
        console.log("NEW JOINER",data)
        this.updateAppState({ players: [...this.state.players, data.joiner] })
        break;

      case Protocol.Reorg:
        console.log("REORG", data)
        this.updateGameState(data)
        break;

      case Protocol.HasStarted:
        console.log("GAME HAS STARTED!")
        this.setState({
          started: true,
        })
        break;

      case Protocol.Turn:
      case Protocol.PlayHand:
        console.log("TURN", data)
        this.updateGameState(data)
        break;

      case Protocol.ReplenishHand:
        console.log("REPLENISH HAND", data)
        this.partiallyUpdateGameState({ message: "Choice accepted", hand: data.hand })
        // send ack
        setTimeout(() => {
          this.sendReply({ command: Protocol.ReplenishHand, decision: [], playerID: this.state.playerID })
        }, 1500)
        break;

      case Protocol.EndOfTurn:
        console.log("END OF TURN")
        break;

      case Protocol.SkipTurn:
        console.log("SKIP TURN", data)
        this.updateGameState(data)
        if (this.state.gameState.isTurn) {
          // send ack
          setTimeout(() => {
            this.sendReply({ command: Protocol.SkipTurn, decision: [], playerID: this.state.playerID })
          }, 1500)
        }
        break;

      case Protocol.Burn:
        console.log("BURN!")
        this.updateGameState(data)
        break;

      default:
        console.log("unknown command", data)
    }
  }

  render() {
    return (
      <div className="App">
        {
          this.state.gameID && 
            <GameRoom 
              gameID={this.state.gameID}
              isAdmin={this.state.isAdmin}
              name={this.state.name}
              players={this.state.players}
              playerID={this.state.playerID}
              started={this.state.started}
              gameState={this.state.gameState}

              initWS={this.initWS}
              startGame={this.startGame}
              sendReply={this.sendReply}
              partiallyUpdateGameState={this.partiallyUpdateGameState}
            />
        }
        {
          !this.state.gameID && 
            <Welcome updateAppState={this.updateAppState} />
        }
      </div>
    );
  }
}

export default App