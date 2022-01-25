import React, { useState } from 'react';
import axios from 'axios';
import RegisterPage from './RegisterPage.jsx';
import LoginPage from './LoginPage.jsx';

const MainPage = ({ setLandingState }) => (
  <>
    <div className="main-buttons">
      <button onClick={() => setLandingState('login')}>Log In</button>
      <button onClick={() => setLandingState('register')}>Register</button>
    </div>
    <div className="lost-password">Trouble Loggin In?</div>
  </>

);

const LandingPage = ({ setAppState }) => {
  const [landingState, setLandingState] = useState('main');

  return (
    <div className="landing-container">
      <div className="main-header"><h1>Chicken Tinder</h1></div>
      <div className="main-container">
        { landingState === 'main' && <MainPage setLandingState={setLandingState} /> }
        { landingState === 'register' && <RegisterPage setLandingState={setLandingState} /> }
        { landingState === 'login' && <LoginPage setLandingState={setLandingState} setAppState={setAppState} /> }
      </div>
    </div>

  );
};

export default LandingPage;
