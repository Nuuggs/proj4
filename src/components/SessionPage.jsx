import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SessionPage = ({ setAppState }) => {
  const [sessionState, setSessionState] = useState(false);
  // retrieve current user id from local storage
  const userId = localStorage.getItem('userId');
  console.log('current user id', userId);
  // On load, make a get request to see if there are
  useEffect(() => {
    axios.get(`/user/session/${userId}`)
      .then((res) => {
        console.log(res);
        const { sessionFound } = res.data;
        if (!sessionFound) return console.log('no current session');
        setSessionState(true);
      })
      .catch((err) => console.log(err));
  }, []);

  const createNewSession = () => {
    // HP: I think the AJAX call should be made when we submit the form

    setAppState('form');
  };

  return (

    <div className="session-page">
      <div className="session-display">
        {sessionState
          ? (
            <p>
              SOMEONE... has invited you to join a session...
              <br />
              Join Session now!
            </p>
          )
          : <p>You have no existing sessions open, create a new session!</p>}
      </div>
      <div className="session-buttons">
        {sessionState ? <button>Join Session</button> : <button disabled>Join Session</button>}
        <button onClick={createNewSession}>Create Session</button>
      </div>
    </div>
  );
};

export default SessionPage;
