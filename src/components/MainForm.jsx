import React, { useState, useEffect } from 'react';
import {
  Box,
} from '@mui/material';
import axios from 'axios';
import { FormOne } from './FormOne.jsx';
import { FormTwo } from './FormTwo.jsx';

const FormComplete = ({ formTwoParams, formOneParams }) => {
  const message = 'Fetching Data';
  useEffect(() => {
    console.log('FormTwoParams', formTwoParams);
    console.log('FormOneParams', formOneParams);
    const allParams = { ...formOneParams, ...formTwoParams };
    console.log('all params', allParams);
    // AJAX request
    axios.post('/restaurants/search', allParams).then(
      (result) => { console.log(result); },
    );
  }, []);
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <h1>
        {message}
      </h1>
    </Box>
  );
};

const MainForm = () => {
  const [formState, setFormState] = useState(1);
  const [formOneParams, setFormOneParams] = useState('');
  const [formTwoParams, setFormTwoParams] = useState('');

  return (
    <div className="form-container">
      {formState === 1 && <FormOne setFormOneParams={setFormOneParams} setFormState={setFormState} />}

      {formState === 2 && <FormTwo setFormTwoParams={setFormTwoParams} setFormState={setFormState} />}

      {formState === 3 && <FormComplete formTwoParams={formTwoParams} formOneParams={formOneParams} />}
    </div>
  );
};

export default MainForm;
