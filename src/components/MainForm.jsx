import React, { useState } from 'react';
import {
  Box,
} from '@mui/material';
import { FormOne } from './FormOne.jsx';
import { FormTwo } from './FormTwo.jsx';

const FormComplete = () => {
  const message = 'Fetching Data';
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
  const [formTwoParams, setFormTwoParams] = useState('testing testing');
  // console.log('form two params', formTwoParams);
  // console.log('set form two params', setFormTwoParams);
  // console.log('form two params after setting', formTwoParams);

  return (
    <div className="form-container">
      {formState === 1 && <FormOne setFormOneParams={setFormOneParams} setFormState={setFormState} />}

      {formState === 2 && <FormTwo formOneParams={formOneParams} formTwoParams={formTwoParams} setFormTwoParams={setFormTwoParams} setFormState={setFormState} />}

      {formState === 3 && <FormComplete />}
    </div>
  );
};

export default MainForm;
