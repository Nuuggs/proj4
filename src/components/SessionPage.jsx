import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Button, Box,
} from '@mui/material';

const SessionPage = ({ setAppState, setSessionId, sessionId }) => {
  const [partner, setPartner] = useState('');
  const [userRole, setUserRole] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  // GET Request on mount: Queries db for any existing session for current user
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

  // Event listener for "New Session" button
  const createNewSession = (e) => {
    e.preventDefault();

    // if there is an existing session and user clicks "New Session", app deletes existing session

    if (sessionId) {
      // DELETE Request: Deletes session in db
      // Post-Demo: Port all session info to separate storage table.

      axios.delete(`/user/delete/${sessionId}`)
        .then((res) => {
          // if successful status 204 will be sent, else status 404

          console.log(res.data);

          // Post-Demo: create alert for when session is successfully deleted
        }).catch((err) => console.log(err));
    }

    // resets props
    setSessionId(null);
    setUserRole(null);
    setPartner(null);

    // clear partner id from local storage
    localStorage.removeItem('p2Id');

    // return to form
    setAppState('form');
  };

  const joinSession = (e) => {
    e.preventDefault();
    setAppState('restaurant');
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
