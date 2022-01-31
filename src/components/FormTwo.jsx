import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, FormControl, InputLabel, Select, MenuItem, Box,
} from '@mui/material';
import { MobileDateTimePicker, LocalizationProvider } from '@mui/lab';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const PartnerChoice = ({ setPartner, setAppState }) => {
  const [friends, setFriends] = useState([]);

  // Get curren user id from local storage
  const currentUserId = localStorage.getItem('userId');
  // AJAX Call: get friends of user from db
  useEffect(() => {
    axios.get(`/user/allFriends/${currentUserId}`)
      .then((result) => {
        setFriends(result.data);
        console.log('axios get friends', result.data);
      });
  }, []);
  console.log('friends', friends);
  const handleChange = (e, value) => {
    // sets chosen partner's uid
    console.log('partner value', value.id);
    setPartner(`${value.id}`);
  };

  const addFriendsClick = (e) => {
    e.preventDefault();
    setAppState('friends');
  };

  return (
    <div>
      {friends ? (
        <div>
          <Autocomplete
            onChange={handleChange}
            // sets options as friends array
            options={friends}
            // renders name of each element of friends
            getOptionLabel={(option) => option.name}
            // What does this line do?
            renderInput={(params) => <TextField {...params} label="Pick a partner" />}
          />
          <Button size="small" onClick={addFriendsClick}>
            Add Friend
          </Button>
        </div>
      )
        : (
          <div>
            <h2>It seems like you don't have any friends yet.</h2>
            <Button size="small" onClick={addFriendsClick}>Add friends</Button>
          </div>
        )}
    </div>

  );
};
const FormTwo = (
  { setFormTwoParams, setFormState, setAppState },
) => {
  // value of price, rating change when select input changes, value of select input is {Params}
  const [dateTime, setDateTime] = useState(new Date());
  const [price, setPrice] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [partner, setPartner] = useState('');
  const cuisineList = [
    'American',
    'French',
    'Chinese',
    'Japanese',
    'Thai',
    'Italian',
  ];

  const handleClick = (e) => {
    e.preventDefault();
    const data = {
      partner,
      dateTime,
      price,
      cuisine,
    };
    setFormTwoParams(data);
    setFormState(3);
  };

  const handleGoBack = (e) => {
    e.preventDefault();
    setFormState(1);
  };

  return (
    <Box>
      <Card
        className="frosted-card"
      >
        <CardContent>
          <CardActions>
            <Button size="small" onClick={handleGoBack}>
              <ArrowLeftOutlinedIcon fontSize="small" />
              Previous
            </Button>
          </CardActions>
          <FormControl fullWidth>
            <PartnerChoice partner={partner} setPartner={setPartner} setAppState={setAppState} />
          </FormControl>
          {/* Date Time Picker */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDateTimePicker
                value={dateTime}
                onChange={(newValue) => {
                  setDateTime(newValue);
                }}
                label="Date & Time"
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          {/* Price select */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="price">Price</InputLabel>
            <Select
              value={price}
              label="price"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            >
              <MenuItem value="1">$</MenuItem>
              <MenuItem value="2">$$</MenuItem>
              <MenuItem value="3">$$$</MenuItem>
              <MenuItem value="4">$$$$</MenuItem>
            </Select>
          </FormControl>
          {/* Cuisine Autocomplete */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <Autocomplete
              id="cuisine-autocomplete"
              onChange={(e, value) => { setCuisine(value); }}
            // users array is mapped into options and rendered
              options={cuisineList.map((option) => option)}
            // What does this line do?
              renderInput={(params) => <TextField {...params} label="Cuisine" />}
            />
          </FormControl>
        </CardContent>

      </Card>
      <Box className="center-box">
        <Button sx={{ width: '280px' }} variant="contained" onClick={handleClick}>Confirm</Button>
      </Box>
    </Box>
  );
};

export { FormTwo };
