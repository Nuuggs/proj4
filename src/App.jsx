import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './components/LandingPage.jsx';
import { AddFriends } from './components/FriendsPage.jsx';
import MainForm from './components/MainForm.jsx';
import SessionPage from './components/SessionPage.jsx';

export default function App() {
  // Global states
  /*
    Default app state set to landing to print landing page first
    Landing -> Match Area -> (create session)Search Params -> Restaurant Details

  */
  const [appState, setAppState] = useState('landing');
  return (
    // <LandingPage />
    // <AddFriends />
    // <MainForm />
    <SessionPage />
  );
}
