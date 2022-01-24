import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, Box, Typography,
} from '@mui/material';

const FriendsList = ({ friendsList }) => {
  console.log('friends list in component FriendsList', friendsList);
  return (
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

          {friendsList.map((friend) => (
            <p>{friend.name}</p>
          ))}

        </CardContent>
      </Card>
    </div>
  );
};

const AddFriends = () => {
  const [chosenFriend, setChosenFriend] = useState('');
  const [friendsList, setFriendsList] = useState([]);

  // get user id from local storage
  localStorage.setItem('userId', '2');
  const currentUserId = localStorage.getItem('userId');

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
    // AJAX request: send both friend email and current user id to backend
    axios.post('/user/friends', { email: chosenFriend, currentUserId })
      .then((result) => {
        console.log(result.data);
        setValidity(result.data.isValid);
        const friendsArray = result.data.updatedUser.friendsUid.friendList;

        setFriendsList(friendsArray);
        console.log(result.data.updatedUser);
        console.log('friends list', friendsList);
      });
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
      {isValid === true && <FriendsList friendsList={friendsList} />}
    </>
  ); };

export { AddFriends };
