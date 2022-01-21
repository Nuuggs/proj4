import React, { useState } from 'react';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, FormControl, InputLabel, Select, MenuItem, Box,
} from '@mui/material';
import { MobileDateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const FormTwo = (
  {
    formOneParams, formTwoParams, setFormTwoParams, setFormState,
  },
) => {
  // value of price, rating change when select input changes, value of select input is {Params}
  console.log('initial form 2 params', formTwoParams);
  console.log(setFormTwoParams);
  const [dateTime, setDateTime] = useState(new Date());
  const [price, setPrice] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState('');
  const cuisineList = [
    'Western',
    'French',
    'Chinese',
    'Japanese',
    'Thai',
    'Italian',
    'American',
  ];

  const handleClick = (e) => {
    e.preventDefault();
    // console.log('handle click running');
    // console.log('dateTime', dateTime);
    // console.log('price', price);
    // console.log('rating', rating);
    // console.log('cuisine', cuisine);

    // post object somewhere here
    const data = {
      dateTime,
      price,
      rating,
      cuisine,
    };
    setFormTwoParams(data);
    // console.log(setFormTwoParams());
    // console.log('data form two', data);
    // console.log('FormOneParams', formOneParams);
    // console.log('FormTwoParams', formTwoParams);

    setFormState(3);
  };

  return (
    <Box>
      <Card
        sx={{
          width: 230,
          backgroundColor: 'primary',
          pt: 1,
          px: 1,
          my: 2,
          mx: 'auto',
        }}
      >

        <CardContent>
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
          {/* Rating select */}
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select
              value={rating}
              label="rating"
              name="rating"
              onChange={(e) => setRating(e.target.value)}
            >
              <MenuItem value="1">★</MenuItem>
              <MenuItem value="2">★★</MenuItem>
              <MenuItem value="3">★★★</MenuItem>
              <MenuItem value="4">★★★★</MenuItem>
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
        <CardActions>
          <Button size="small" onClick={handleClick}>Confirm</Button>
        </CardActions>

      </Card>
    </Box>
  );
};

export { FormTwo };
