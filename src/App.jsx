import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import LandingPage from './components/LandingPage.jsx';
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
  return (
    <>
      <ThemeProvider theme={mainTheme}>
        { appState === 'landing' && <LandingPage appState={appState} setAppState={setAppState} /> }
        { appState === 'session' && <SessionPage appState={appState} setAppState={setAppState} /> }
        { appState === 'friends' && <AddFriends appState={appState} setAppState={setAppState} /> }
        { appState === 'form' && <MainForm appState={appState} setAppState={setAppState} /> }
        {appState !== 'landing' && <Navigation appState={appState} setAppState={setAppState} />}
      </ThemeProvider>
      {/* <RestaurantPage /> */}
    </>

  );
}
