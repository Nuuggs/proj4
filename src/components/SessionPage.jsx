import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, Button, Autocomplete, Box,
} from '@mui/material';

const SessionPage = ({ setAppState, setSessionId, sessionId }) => {
  // retrieve current user id from local storage
  const userId = localStorage.getItem('userId');
  console.log('current user id', userId);

  // On load, make a get request to see if there are
  useEffect(() => {
    axios.get(`/user/session/${userId}`)
      .then((res) => {
        console.log(res);
        if (sessionFound) {
          const { id } = res.data;
          setSessionId(id);
        }
        if (!sessionFound) return console.log('no current session');
      })
      .catch((err) => console.log(err));
  }, []);

  const createNewSession = () => {
    setAppState('form');
  };

  const joinSession = () => {
    console.log('need to join some session');
  };

  const handleClick = (e) => {
    e.preventDefault();
    // Packaging same page info into object
  };

  return (

    <div>
      <Card className="frosted-card">
        {sessionId
          ? (
            <p>
              SOMEONE... has invited you to join a session...
              <br />
              Join Session now!
            </p>
          )
          : <p>You have no existing sessions open, create a new session!</p>}
      </Card>
      <Box className="center-box">
        <Button className="wide-button" variant="contained" onClick={createNewSession}>Create New Session</Button>
      </Box>
      <Box className="center-box">
        {sessionId
          ? <Button className="wide-button" variant="contained" onClick={joinSession}>Join Session</Button>
          : <Button disabled className="wide-button" variant="contained" onClick={joinSession}>Join Session</Button>}
      </Box>

    </div>
  );
};

export default SessionPage;
