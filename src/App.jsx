import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import UserAuth from './components/NewLoginPage.jsx';
import { AddFriends } from './components/FriendsPage.jsx';
import MainForm from './components/FormPage.jsx';
import SessionPage from './components/SessionPage.jsx';
import Navigation from './components/NavBar.jsx';
import mainTheme from './theme.jsx';
import RestaurantPage from './components/RestaurantCard.jsx';

export default function App() {
  // Global states
  /*
    Default app state set to landing to print landing page first
    Landing -> Match Area -> (create session)Search Params -> Restaurant Details

  */

  const [appState, setAppState] = useState('landing');
  const [appParams, setAppParams] = useState({});
  const [sessionId, setSessionId] = useState(null);

  return (
    <>
      <ThemeProvider theme={mainTheme}>
        { appState === 'landing' && <UserAuth appState={appState} setAppState={setAppState} /> }
        { appState === 'session' && <SessionPage appState={appState} setAppState={setAppState} setSessionId={setSessionId} sessionId={sessionId} /> }
        { appState === 'friends' && <AddFriends appState={appState} setAppState={setAppState} /> }
        { appState === 'form' && <MainForm appState={appState} setAppState={setAppState} setAppParams={setAppParams} /> }
        {appState !== 'landing' && <Navigation appState={appState} setAppState={setAppState} />}
        { appState === 'restaurant' && <RestaurantPage appState={appState} setAppState={setAppState} appParams={appParams} /> }
      </ThemeProvider>
    </>

  );
}
