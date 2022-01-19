import React, { useState } from 'react';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, FormControl, InputLabel, Select, MenuItem, Box, FormLabel,
} from '@mui/material';
import { spacing } from '@mui/system';

const PartnerChoice = () => {
  // Dummy users
  const users = [
    {
      name: 'Doraemon',
      email: 'doraemon@future.com',
      password: 'doradora',
    },
    {
      name: 'Nobita',
      email: 'nobita@future.com',
      password: 'nobinobi',
    },
    {
      name: 'Shizuka',
      email: 'shizuka@future.com',
      password: 'shizushizu',
    },
    {
      name: 'Dorami',
      email: 'dorami@future.com',
      password: 'doradora',
    },
  ];

  return (
    <>
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
          <Autocomplete
            id="free-solo-demo"
            freeSolo
            // users array is mapped into options and rendered
            options={users.map((option) => option.name)}
            // What does this line do?
            renderInput={(params) => <TextField {...params} label="Partner" />}
          />
        </CardContent>
        <CardActions>
          <Button size="small">Confirm</Button>
        </CardActions>

      </Card>
    </>
  );
};

const RestaurantParameters = () => {
  // value of price, rating change when select input changes, value of select input is {parameters}
  // sending parameters as an object
  const [parameters, setParameters] = useState({
    price: '',
    rating: '',
  });

  const dummyLocations = [
    'Bukit Timah',
    'Bukit Batok',
    'Khatib',
    'Simei',
    'Loyang',
    'Aljunied',
    'Alexandra',
  ];

  const handleChange = (e) => {
    const { value } = e.target;
    setParameters({
      ...parameters,
      [e.target.name]: value,
    });
    console.log(parameters);
  };

  const handleClick = (e) => {
    e.preventDefault();
    console.log('handle click running');
    console.log(parameters);
    // post object somewhere here
    setParameters({
      price: '',
      rating: '',
    });
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
        <form>
          <CardContent>
            {/* Location autocomplete */}
            <Autocomplete
              id="free-solo-location"
              freeSolo
              onChange={handleChange}
            // dummyLocations array is mapped into options and rendered
              options={dummyLocations.map((option) => option)}
            // What does this line do?
              renderInput={(params) => <TextField {...params} label="Location" name="location" />}
            />
            {/* Price select */}
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="price">Price</InputLabel>
              <Select
                value={parameters.price}
                label="price"
                name="price"
                onChange={handleChange}
              >
                <MenuItem value="$">$</MenuItem>
                <MenuItem value="$$">$$</MenuItem>
                <MenuItem value="$$$">$$$</MenuItem>
              </Select>
            </FormControl>
            {/* Rating select */}
            <FormControl fullWidth sx={{ my: 1 }}>
              <InputLabel id="rating">Rating</InputLabel>
              <Select
                value={parameters.rating}
                label="rating"
                name="rating"
                onChange={handleChange}
              >
                <MenuItem value="★">★</MenuItem>
                <MenuItem value="★★">★★</MenuItem>
                <MenuItem value="★★★">★★★</MenuItem>
              </Select>

            </FormControl>

          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleClick}>Confirm</Button>
          </CardActions>
        </form>
      </Card>
    </Box>
  );
};

export { PartnerChoice, RestaurantParameters };
