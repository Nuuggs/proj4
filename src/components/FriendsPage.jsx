import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, Box, Typography,
} from '@mui/material';

const FriendsList = ({ friendsList, setFriendsList }) => {
  const currentUserId = localStorage.getItem('userId');
  useEffect(() => {
    axios.get(`/user/allFriends/${currentUserId}`)
      .then((result) => {
        setFriendsList(result.data);
        console.log('result.data', result.data);
      });
  }, []);

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
          {friendsList
            ? (
              <div>
                {friendsList.map((friend) => (
                  <p>{friend.name}</p>
                ))}
              </div>
            )
            : <p>You don't have any friends</p>}

        </CardContent>
      </Card>
    </div>
  );
};
const AddFriends = () => {
  const [chosenFriend, setChosenFriend] = useState('');
  const [friendsList, setFriendsList] = useState(null);

  // get user id from local storage
  const currentUserId = localStorage.getItem('userId');

  const [isValid, setValidity] = useState(null);

  const handleChange = (e) => {
    setChosenFriend(e.target.value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    // AJAX request: send both friend email and current user id to backend
    axios.post('/user/friends', { email: chosenFriend, currentUserId })
      .then((result) => {
        console.log(result.data);
        setValidity(result.data.isValid);
        const friendsArray = result.data.updatedUser.friendsUid.friendsList;

        setFriendsList(friendsArray);
      }).catch((error) => {
        setValidity(false);
      });
  };
  console.log('friends list in add friends', friendsList);

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
      <FriendsList friendsList={friendsList} setFriendsList={setFriendsList} />
    </>
  ); };

export { AddFriends };
