import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setLandingState }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loginState, setLoginState] = useState('email');

  const submitLoginEmail = (event) => {
    // Query the database for the email, get the name
    axios.post('/user/email', {email: email})
    .then((res)=>{
      console.log(res.data); // {success, name}
      setName(res.data.name);
    })
    .catch((err)=>console.log(err));
    setLoginState('password');
  };

  const submitPassword = (event) => {
    const loginObj = { email: email, name: name, password: password };
    axios.post('/user/login', loginObj)
      .then((res) => {
        console.log(res.data); // res.data.loginSuccess
        // setLandingState('login');
        // if(res.data.loginSuccess) setAppState ...
      })
      .catch((err)=>console.log(err));
  }

  const returnToMain = (event) => {
    setName('');
    setEmail('');
    setPassword('');
    setLandingState('main');
  };

  return (<>
    <h3>Login</h3>
    <div className="landing-display">
      { name && <p>Welcome back {name}!</p> }
    </div>

    <div>
      { loginState === 'email' && 
        (
          <>
            <label htmlFor="email">Hello, welcome back. Help us identify you through the e-mail you registered with!</label><br></br>
            <input type="text" name="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button type="submit" onClick={submitLoginEmail}>Submit</button>  
          </>
        )
      }
      { loginState === 'password' && 
        (
          <>
            <label htmlFor="password">Now please key in your password</label>
            <input type="text" name="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="submit" onClick={submitPassword}>Submit</button>  
          </>
        )
      }
      { loginState === 'complete' && 
        (
          <h3>Your account has been registered, please click on the 'back' button below to return to the main page to log in!</h3>
        )
      }
    </div>
    <button onClick={returnToMain}>Back</button>
  </>)
}

export default LoginPage;