import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage.jsx';
import { AddFriends } from './components/FriendsPage.jsx';
import MainForm from './components/FormPage.jsx';
import SessionPage from './components/SessionPage.jsx';

export default function App() {
  // Global states
  /*
    Default app state set to landing to print landing page first
    Landing -> Match Area -> (create session)Search Params -> Restaurant Details

  */
  const [appState, setAppState] = useState('landing');
  return (
    <>
      { appState === 'landing' && <LandingPage appState={appState} setAppState={setAppState} /> }
      { appState === 'session' && <SessionPage appState={appState} setAppState={setAppState} /> }
      { appState === 'friends' && <AddFriends appState={appState} setAppState={setAppState} /> }
      { appState === 'form' && <MainForm appState={appState} setAppState={setAppState} /> }
    </>

  );
}
