import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setLandingState }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
};

const RegisterPage = ({ setLandingState }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerState, setRegisterState] = useState('name');

  const submitPassword = (event) => {
    const registerObj = { email, name, password };
    setRegisterState('complete');
    axios.post('/user/register', registerObj)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  };

  const returnToMain = (event) => {
    setName('');
    setEmail('');
    setPassword('');
    setLandingState('main');
  };

  return (
    <>
      <h3>Registration</h3>
      <div className="landing-display">
        { name && (
        <p>
          Hello
          {name}
        </p>
        ) }
        { email && <p>Email stored.</p> }
      </div>

      <div>
        { registerState === 'name'
        && (
          <>
            <label htmlFor="name">Hi, what's your name?</label>
            <input type="text" name="name" id="name" value={name} onChange={(event) => setName(event.target.value)} />
            <button type="submit" onClick={() => setRegisterState('email')}>Submit</button>
          </>
        )}
        { registerState === 'email'
        && (
          <>
            <label htmlFor="email">Can we please have your email to identify you in the future?</label>
            <input type="text" name="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button type="submit" onClick={() => setRegisterState('password')}>Submit</button>
          </>
        )}
        { registerState === 'password'
        && (
          <>
            <label htmlFor="password">Please enter a password for your account</label>
            <input type="text" name="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="submit" onClick={submitPassword}>Submit</button>
          </>
        )}
        { registerState === 'complete'
        && (
          <h3>Your account has been registered, please click on the 'back' button below to return to the main page to log in!</h3>
        )}
      </div>
      <button onClick={returnToMain}>Back</button>
    </>
  );
};

const MainPage = ({ setLandingState }) => (
  <>
    <div className="main-buttons">
      <button onClick={() => setLandingState('login')}>Log In</button>
      <button onClick={() => setLandingState('register')}>Register</button>
    </div>
    <div className="lost-password">Trouble Loggin In?</div>
  </>
);

const LandingPage = () => {
  const [landingState, setLandingState] = useState('main');

  const [loginObj, setLoginObj] = useState({});

  return (
    <div className="landing-container">
      <div className="main-header"><h1>Chicken Tinder</h1></div>
      <div className="main-container">
        { landingState === 'main' && <MainPage setLandingState={setLandingState} /> }
        { landingState === 'register' && <RegisterPage setLandingState={setLandingState} /> }
        { landingState === 'login' && <LoginPage setLandingState={setLandingState} /> }
      </div>
    </div>

  );
};

export default LandingPage;
