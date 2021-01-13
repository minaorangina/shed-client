import './Welcome.css'
import { Formik, Field, Form } from 'formik';

function handleNewGameSubmit(values) {
  console.log(values)
}

function handleJoinGameSubmit(values) {
  console.log(values)
}

function Welcome() {
  return (
    <>
      <h1>Shed!</h1>
      <div className="welcome">
        <NewGame />
        <JoinGame />
      </div>
    </>
  )
}

export default Welcome;

function NewGame() {
  return   (
    <div className="form-wrapper">
      <h3>Create a new game</h3>
      <Formik
        initialValues={{
          name:'',
        }}
        onSubmit={handleNewGameSubmit}
        >
        <Form className="form">
          <label htmlFor="new-name">Your name</label>
          <Field id="new-name" name="new-name" />
          <button type="submit">Create</button>
        </Form>
      </Formik>
    </div>
  )
}

function JoinGame() {
  return (
    <div className="form-wrapper">
      <h3>Join a game</h3>
      <Formik
      initialValues={{
        joinName:'',
        joinCode: '',
      }}
      onSubmit={handleJoinGameSubmit}
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