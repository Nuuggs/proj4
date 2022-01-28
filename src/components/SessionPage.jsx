import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Button, Box,
} from '@mui/material';

const SessionPage = ({ setAppState, setSessionId, sessionId }) => {
  const [partner, setPartner] = useState('');
  const [userRole, setUserRole] = useState(null);

  // GET Request on mount: Queries db for any existing session for current user
  useEffect(() => {
    const id = localStorage.userId;
    console.log('current user id', id);
    axios.get(`/user/session/${id}`)
      .then((res) => {
        console.log(res);

        // If there is an existing session in db, userRole determines if user is host or not
        // userRole === 'p1' means user is host

        if (res.data.sessionFound) {
          setSessionId(res.data.sessionPk);
          setPartner(res.data.partner);
          setUserRole(res.data.userRole);

          // Set p1Id and p2Id in local storage so that it is accessible later on
          localStorage.setItem('p1Id', res.data.p1Id);
          localStorage.setItem('p2Id', res.data.p2Id);
        }
        else if (!res.data.sessionFound) return console.log('no current session');
      })
      .catch((err) => console.log(err));
  }, []);

  console.log('existing session id', sessionId);
  console.log('user role', userRole);

  // Event listener for "New Session" button
  const createNewSession = (e) => {
    e.preventDefault();

    // If there is an existing session and user clicks "New Session", app deletes existing session

    if (sessionId) {
      // DELETE Request: Deletes session in db
      // Post-Demo: Port all session info to separate storage table.

      axios.delete(`/user/delete/${sessionId}`)
        .then((res) => {
          // If successful status 204 will be sent, else status 404

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

      <Card className="frosted-card align-text" sx={{ mt: '30px', minHeight: '300px' }}>
        {userRole === 'p2'
        && (
        <CardContent>
          <h2>
            <span className="emphasis-text">{partner}</span>
            {' '}
            invites you to join a session.
          </h2>
          <h2>
            Or, create a new session. Doing so will delete your session with
            {' '}
            <span className="emphasis-text">{partner}</span>
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
