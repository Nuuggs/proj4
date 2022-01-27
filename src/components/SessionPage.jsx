import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, Button, Autocomplete, Box,
} from '@mui/material';

const SessionPage = ({ setAppState, setSessionId, sessionId }) => {
  const [host, setHost] = useState('');

  // On load, make a get request to see if there are any existing sessions
  useEffect(() => {
    const id = localStorage.userId;
    console.log('current user id', id);
    axios.get(`/user/session/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.sessionFound) {
          const { sessionPk } = res.data;
          setSessionId(sessionPk);
          const { p1Name } = res.data;
          setHost(p1Name);
        }
        else if (!res.data.sessionFound) return console.log('no current session');
      })
      .catch((err) => console.log(err));
  }, []);

  console.log('existing session id', sessionId);
  console.log('host', host);

  const createNewSession = () => {
    setSessionId(null);
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
            <CardContent>
              <h2>
                <u>{host}</u>
                {' '}
                has invited you to join a session. Join now, or create a new session.
              </h2>
              <h2>
                Creating a new session closes your current open session with
                {' '}
                <u>{host}</u>
              </h2>
            </CardContent>
          )
          : (
            <CardContent>
              <h2>
                You have no open sessions, create one and invite a friend!
              </h2>
            </CardContent>
          )}
      </Card>
      <Box className="center-box" sx={{ my: '20px' }}>
        <Button className="wide-button" variant="contained" onClick={createNewSession}>Create New Session</Button>
      </Box>
      <Box className="center-box" sx={{ my: '20px' }}>
        {sessionId
          ? <Button className="wide-button" variant="contained" onClick={joinSession}>Join Session</Button>
          : <Button disabled className="wide-button" variant="contained" onClick={joinSession}>Join Session</Button>}
      </Box>

    </div>
  );
};

export default SessionPage;
