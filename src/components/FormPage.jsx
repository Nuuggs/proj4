import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import mainTheme from '../theme.jsx';
import { FormOne } from './FormOne.jsx';
import { FormTwo } from './FormTwo.jsx';

const FormComplete = ({
  formTwoParams, formOneParams, setAppState, setAppParams,
}) => {
  const message = 'Fetching Data';
  const currentUserId = { currentUserId: localStorage.getItem('userId') };

  // Set current user id as p1Id in localStorage
  // p1 always submits the form to create new session, p2 joins session created

  localStorage.setItem('p1Id', currentUserId);

  useEffect(() => {
    console.log('FormTwoParams', formTwoParams);
    console.log('FormOneParams', formOneParams);
    const allParams = { ...currentUserId, ...formOneParams, ...formTwoParams };

    console.log('all params', allParams);
    localStorage.setItem('p2Id', allParams.partner);
    // AJAX request
    // axios.post('/user/session/new', { userId: 1, matchId: 2, parameters: 'pseudo-data' });
    setAppParams(allParams);
    setAppState('restaurant');
  }, []);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <h1>
        {message}
      </h1>
    </Box>
  );
};

const MainForm = ({ appState, setAppState, setAppParams }) => {
  const [formState, setFormState] = useState(1);
  const [formOneParams, setFormOneParams] = useState('');
  const [formTwoParams, setFormTwoParams] = useState('');

  return (

    <div className="form-container">
      <div className="header-box">
        <h1>
          Tell us
          {' '}
          <br />
          what you
          <br />
          {' '}
          want
        </h1>
      </div>
      <ThemeProvider theme={mainTheme}>
        {formState === 1 && <FormOne setFormOneParams={setFormOneParams} setFormState={setFormState} setAppState={setAppState} />}

        {formState === 2 && <FormTwo setFormTwoParams={setFormTwoParams} setFormState={setFormState} />}

        {formState === 3 && <FormComplete formTwoParams={formTwoParams} formOneParams={formOneParams} setAppState={setAppState} setAppParams={setAppParams} />}
      </ThemeProvider>
    </div>
  );
};

export default MainForm;
