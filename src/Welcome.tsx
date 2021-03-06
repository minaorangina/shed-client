import './Welcome.css'
import { Formik, Field, Form } from 'formik';
import { PendingGame, PendingGameJoined, PlayerInfo } from './types'

interface WelcomeProps {
  updateAppState: Function,
}


function Welcome({ updateAppState } : { updateAppState: Function }) {
  return (
    <>
      <h1>Shed!</h1>
      <div className="welcome">
        <NewGame updateAppState={updateAppState} />
        <JoinGame updateAppState={updateAppState} />
      </div>
    </>
  )
}

export default Welcome;



function NewGame(props: WelcomeProps) {
  return (
    <div className="form-wrapper">
      <h3>Create a new game</h3>
      <Formik
        validate={handleValidation}
        initialValues={{
          newName:'',
        }}
        onSubmit={values => handleNewGameSubmit(values, props.updateAppState)}
        >
        <Form className="form">
          <label htmlFor="new-name">Your name</label>
          <Field id="new-name" name="newName" />

          <button type="submit">Create</button>
        </Form>
      </Formik>
    </div>
  )
}

function JoinGame(props: WelcomeProps) {
  return (
    <div className="form-wrapper">
      <h3>Join a game</h3>
      <Formik
      validate={handleValidation}
      initialValues={{
        joinName:'',
        joinCode: '',
      }}
      onSubmit={values => handleJoinGameSubmit(values, props.updateAppState)}
      >
        <Form className="form">
          <label htmlFor="join-name">Your name</label>
          <Field id="join-name" name="joinName" />

          <label htmlFor="join-code">Game code</label>
          <Field id="join-code" name="joinCode" />

          <button type="submit">Join</button>
        </Form>
      </Formik>
    </div>
  )
}

function handleNewGameSubmit(values: any, updateAppState: Function) {
  const req = new Request("http://localhost:8000/new", {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify({
        name: values.newName,
      }),
    })
    fetch(req)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
        }
        return res.json()
      })
      .then((data: PendingGame) => {
        console.log("pending game", data)
        updateAppState({...data, players: [data.playerInfo]})
      })
      .catch(console.error)
}

function handleJoinGameSubmit(values: any, updateAppState: Function) {
   const req = new Request("http://localhost:8000/join", {
      method: "POST",
      headers: new Headers(),
      body: JSON.stringify({
        name: values.joinName,
        gameID: values.joinCode,
      }),
    })
    fetch(req)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
        }
        return res.json()
      })
      .then((data: PendingGameJoined) => {
        const players: PlayerInfo[] = [...data.players, data.playerInfo]
        console.log("playersss", players)
        updateAppState({...data, players})
      })
      .catch(console.error)
}

function handleValidation(values: any) {
  const errors: any = {}

  if (values.newName && values.newName === '') {
    errors.name = "Name is required"
  }
  if (values.joinName && values.joinName === '') {
    errors.name = "Name is required"
  }
  if (values.joinCode && values.joinCode === '') {
    errors.code = "Game code is required"
  }

  return errors
}