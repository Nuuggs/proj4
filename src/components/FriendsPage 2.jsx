import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, Box, Typography,
} from '@mui/material';

const FriendsList = ({ chosenFriend }) => (
  <div>
    <Card
      sx={{
        width: 280,
        backgroundColor: 'primary',
        pt: 1,
        px: 1,
        my: 2,
        mx: 'auto',
      }}
    >
      <CardContent>
        <p>
          Friend's List
        </p>
        <p>
          {chosenFriend}
        </p>
      </CardContent>
    </Card>
  </div>
);
const AddFriends = () => {
  const [chosenFriend, setChosenFriend] = useState('');
  // const [friendsList, setFriendsList] = useState(null);

  const [isValid, setValidity] = useState(null);

  // useEffect(() => {
  //   axios.get('/user/friends')
  //     .then((result) => {
  //       setFriendsList(result.data);
  //       console.log(result.data);
  //       console.log(friendsList);
  //     });
  // }, []);
  // console.log(friendsList);

  const handleChange = (e) => {
    console.log(e.target.value);
    setChosenFriend(e.target.value);
    console.log('chosen friend', chosenFriend);
  };

  const handleClick = (e) => {
    e.preventDefault();
    axios.post('/user/friends', { email: chosenFriend })
      .then((result) => {
        setValidity(result.data);
        console.log(result.data);
      });
    console.log('validity', isValid);
    console.log('chosen friend', chosenFriend);
  };

  // if (!friendsList) return null;
  return (
    <>
      <Card
        sx={{
          width: 280,
          backgroundColor: 'primary',
          pt: 1,
          px: 1,
          my: 2,
          mx: 'auto',
        }}
      >
        <form>
          <CardContent>
            {(isValid === null || isValid === true) && (
            <TextField
              label="Add a Friend"
              onChange={handleChange}
            />
            )}

            {isValid === false && (
            <TextField
              error
              id="outlined-error-helper-text"
              label="Error"
              defaultValue={chosenFriend}
              helperText="This email does not exist. Try again."
              onChange={handleChange}
            />
            )}

          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={handleClick}
            >
              Confirm

            </Button>
          </CardActions>
        </form>

      </Card>
      {isValid === true && <FriendsList chosenFriend={chosenFriend} />}
    </>
  ); };

export { AddFriends };
