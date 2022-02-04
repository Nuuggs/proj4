import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, CardActions, Button, Box,
} from '@mui/material';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';

const EmailField = ({
  setLoginState, setName, setEmail, email,
}) => {
  const [error, setError] = useState(null);
  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const submitEmail = (e) => {
    e.preventDefault();

    axios.post('/user/email', { email })
      .then((res) => {
        if (
          res.data.found === true) {
          setLoginState('login');
          setName(res.data.name);
        } else if (
          res.data.found === false) {
          setLoginState('register');
        }
      }).catch((err) => {
        setError(true);
      });
  };
  return (
    <div>
      <Card className="frosted-card">
        <CardContent>
          <h1>Here to help you decide what to eat.</h1>
        </CardContent>
        {!error && (
          <CardContent>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              helperText="Enter your email.

            We'll check if you're registered."
              onChange={emailChange}
            />
          </CardContent>
        )}

        {error && (
        <CardContent>
          <TextField error fullWidth label="Email" variant="outlined" helperText="Invalid Email, try again." onChange={emailChange} />
        </CardContent>
        )}

      </Card>
      <Box className="center-box">
        <Button className="wide-button" variant="contained" onClick={submitEmail}>Next</Button>
      </Box>
    </div>
  );
};

const LoginFunction = ({
  email, setPassword, name, password, setAppState, setLoginState, setEmail, setName
}) => {
  const [error, setError] = useState(null);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleBack = (e) => {
    e.preventDefault();
    setLoginState('start');
    setEmail('');
    setName('');
  };


  const submitLoginPassword = (e) => {
    e.preventDefault();
    const loginObj = { email, name, password };
    axios.post('/user/login', loginObj)
      .then((res) => {
        if (res.data.success) {
          setAppState('session');
          const { id } = res.data;
          localStorage.setItem('userId', id);
          localStorage.setItem('authToken', res.data.token);
        }
      })
      .catch((err) => {
        console.log('generic err', err);
        setError(true);
      });
  };

  return (
    <div>
      <Card className="frosted-card" sx={{ minHeight: '310.8px' }}>
        <CardContent>
          <CardActions>
            <Button size="small" onClick={handleBack}>
              <ArrowLeftOutlinedIcon fontSize="small" />
              Back
            </Button>
          </CardActions>
          <h2>
            Hey
            {' '}
            <span className="emphasis-text">
              {name}
            </span>
            , welcome back!
            {' '}
          </h2>
          <h2>
            You know
            {' '}
            <br />
            the drill,
            {' '}
            <br />
            password please.
          </h2>
        </CardContent>

        {!error && (
        <CardContent>
          <TextField fullWidth label="Password" type="password" variant="outlined" onChange={handlePasswordChange} />
        </CardContent>
        )}

        {error && (
        <CardContent>
          <TextField error fullWidth label="Password" type="password" helperText="Invalid password" variant="outlined" onChange={handlePasswordChange} />
        </CardContent>
        )}

      </Card>
      <Box className="center-box">
        <Button className="wide-button" variant="contained" onClick={submitLoginPassword}>Next</Button>
      </Box>
    </div>
  );
};

const RegisterFunction = ({
  email, name, setName, setPassword, password, setAppState, setLoginState, setEmail
}) => {
  const [error, setError] = useState(null);
  const nameChange = (e) => {
    setName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleBack = (e) => {
    e.preventDefault();
    setLoginState('start');
    setEmail('');
  };

  const submitSignup = (e) => {
    e.preventDefault();
    const registerObj = { email, name, password };
    axios.post('/user/register', registerObj)
      .then((res) => {
        if (res.data.success === true) {
          setAppState('session');
          const { id } = res.data;
          localStorage.setItem('userId', id);
          localStorage.setItem('authToken', res.data.token);
        }
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };
  return (
    <div>
      <Card className="frosted-card">
        <CardContent>
          <CardActions>
            <Button size="small" onClick={handleBack}>
              <ArrowLeftOutlinedIcon fontSize="small" />
              Back
            </Button>
          </CardActions>
          <h2>
            Hello Stranger, give us a name and password.
          </h2>
          <h2>
            We'll get you registered right away.
          </h2>
        </CardContent>
        {!error && (
        <div>
          <CardContent>
            <TextField fullWidth label="Name" variant="outlined" onChange={nameChange} />
          </CardContent>
          <CardContent>
            <TextField fullWidth label="Password" type="password" variant="outlined" onChange={handlePasswordChange} />
          </CardContent>
        </div>
        )}
        {error && (
        <div>
          <CardContent>
            <TextField error fullWidth label="Name" variant="outlined" onChange={nameChange} />
          </CardContent>
          <CardContent>
            <TextField error fullWidth label="Password" type="password" helperText="Ensure all fields are filled in." variant="outlined" onChange={handlePasswordChange} />
          </CardContent>
        </div>
        )}

      </Card>
      <Box className="center-box"><Button className="wide-button" variant="contained" onClick={submitSignup}>Next</Button></Box>
    </div>
  ); };

const UserAuth = ({ setAppState }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginState, setLoginState] = useState('start');

  return (
    <div>
      <div className="header-box">
        <h3>Chicken Tinder</h3>
      </div>
      {/* start */}
      {loginState === 'start'
      && <EmailField setLoginState={setLoginState} setName={setName} setEmail={setEmail} email={email} setAppState={setAppState} />}

      {/* login */}
      {loginState === 'login' && <LoginFunction email={email} setPassword={setPassword} name={name} password={password} setAppState={setAppState} setLoginState={setLoginState} setEmail={setEmail} setName={setName} />}
      {/* register */}
      {loginState === 'register' && <RegisterFunction email={email} setPassword={setPassword} name={name} setName={setName} password={password} setAppState={setAppState} setLoginState={setLoginState} setEmail={setEmail} />}

    </div>
  );
};

export default UserAuth;
