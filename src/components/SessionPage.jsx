import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, Button, Autocomplete, Box,
} from '@mui/material';

const SessionPage = ({ setAppState, setSessionId, sessionId }) => {
  const [partner, setPartner] = useState('');
  const [userRole, setUserRole] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  // On load, make a get request to see if there are any existing sessions
  useEffect(() => {
    const id = localStorage.userId;
    console.log('current user id', id);
    axios.get(`/user/session/${id}`)
      .then((res) => {
        console.log(res);

        // if there is an existing session in db, userRole determines if user is host or not
        // userRole === 'p1' means user is host

        if (res.data.sessionFound) {
          setSessionId(res.data.sessionPk);
          setPartner(res.data.partner);
          setUserRole(res.data.userRole);
        }
        else if (!res.data.sessionFound) return console.log('no current session');

        // setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log('existing session id', sessionId);
  console.log('user role', userRole);
  // console.log('isLoading', isLoading);

  const createNewSession = (e) => {
    e.preventDefault();
    setSessionId(null);
    setUserRole(null);
    setPartner(null);
    setAppState('form');
  };

  const joinSession = (e) => {
    e.preventDefault();
    console.log('need to join some session');
  };

  return (
    <div>

      <Card className="frosted-card">
        {userRole === 'p2'
        && (
        <CardContent>
          <h2>
            <u>{partner}</u>
            {' '}
            has invited you to join a session. Join now, or create a new session.
          </h2>
          <h2>
            Creating a new session closes your current open session with
            {' '}
            <u>{partner}</u>
          </h2>
        </CardContent>
        )}
        {userRole === 'p1'
        && (
        <CardContent>
          <h2>
            Open session with
            {' '}
            <u>{partner}</u>
            {' '}
            available.
          </h2>
          <h2>
            Creating a new session closes your current open session with
            {' '}
            <u>{partner}</u>
          </h2>
        </CardContent>
        )}
        {!sessionId && (
        <CardContent>
          <h2>
            You have no open sessions, create one and invite a friend!
          </h2>
        </CardContent>
        )}
      </Card>
      <Box className="center-box" sx={{ my: '20px' }}>
        <Button className="wide-button" variant="contained" onClick={createNewSession}>New Session</Button>
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
