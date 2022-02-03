import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, Button, Box,
} from '@mui/material';

const SessionPage = ({ setAppState, setSessionId, sessionId }) => {
  // Set/reset as user maybe coming to session page from previous session
  const [partner, setPartner] = useState('');
  const [userRole, setUserRole] = useState(null);
  localStorage.removeItem('p1Id');
  localStorage.removeItem('p2Id');

  // GET Request on mount: Queries db for any existing session for current user
  useEffect(async () => {
    const id = localStorage.userId;
    console.log('current user id', id);

    // User Auth for /user/session/:id
    const token = localStorage.getItem('authToken');
    if (!token) return alert('NO VALID TOKEN!');
    const config = { headers: { authorization: `Bearer ${token}` } };

    const result = await axios.get(`/user/session/${id}`, config);

    console.log('<=== result from get session ===>', result);

    if (!result.data.sessionFound) {
      // sessionId might have persisted from previous session
      setSessionId(null);
    }
    // If there is an existing session in db, userRole determines if user is host or not
    // userRole === 'p1' means user is host

    else if (result.data.sessionFound) {
      setSessionId(result.data.sessionPk);
      setPartner(result.data.partner);
      setUserRole(result.data.userRole);

      // Set p1Id and p2Id in local storage so that it is accessible later on
      localStorage.setItem('p1Id', result.data.p1Id);
      localStorage.setItem('p2Id', result.data.p2Id);
    }
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

      // User Auth for /user/delete/:sessionId
      const token = localStorage.getItem('authToken');
      if (!token) return alert('NO VALID TOKEN!');
      const config = { headers: { authorization: `Bearer ${token}` } };

      axios.delete(`/user/delete/${sessionId}`, config)
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
