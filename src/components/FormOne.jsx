import React, { useState } from 'react';
import {
  TextField, Card, CardContent, CardActions, Button, Autocomplete, Box,
} from '@mui/material';

import {
  GoogleMap,
  useLoadScript,
  Autocomplete as GoogleAutocomplete,
} from '@react-google-maps/api';

import mapStyles from '../mapStyles.js';

const libraries = ['places'];
const mapContainerStyle = {
  marginTop: '10px',
  width: '228px',
  height: '280px',
};

const PartnerChoice = ({ partner, setPartner }) => {
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

  const handleChange = (e, value) => {
    console.log(value);
    setPartner(value);
  };

  return (

    <CardContent>
      <Autocomplete
        id="free-solo-demo"
        onChange={handleChange}
            // users array is mapped into options and rendered
        options={users.map((option) => option.name)}
            // What does this line do?
        renderInput={(params) => <TextField {...params} label="Pick a partner" />}
      />
    </CardContent>

  );
};

const Map = ({ coordinates, setCoordinates }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [autocomplete, setAutocomplete] = useState(null);
  const onLoad = (autoC) => setAutocomplete(autoC);
  const onPlaceChanged = () => {
    // Google Maps API command
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();
    // Sets Coordinates on the map
    setCoordinates({ lat, lng });
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';

  // Google Map options, all UI disabled
  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
  };
  return (

    <CardContent>
      <GoogleAutocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <TextField
          sx={{
            width: '228px',
          }}
          label="Search"
          variant="outlined"
        />
      </GoogleAutocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={coordinates}
        options={options}
      />
    </CardContent>

  );
};

const FormOne = ({ setFormOneParams, setFormState }) => {
  const [partner, setPartner] = useState('');
  const [coordinates, setCoordinates] = useState({
    // Singapore's coordinates
    lat: 1.3521,
    lng: 103.8198,
  });

  const handleClick = (e) => {
    e.preventDefault();
    console.log('page 1 form click running');
    // Packaging same page info into object
    const data = {
      coordinates,
      partner,
    };
    console.log('coordinates', coordinates);
    console.log('partner', partner);

    setFormOneParams(data);
    setFormState(2);
  };

  return (
    <div>
      <Card className="frosted-card">
        <PartnerChoice partner={partner} setPartner={setPartner} />
        <Map coordinates={coordinates} setCoordinates={setCoordinates} />
      </Card>
      <Box className="center-box">
        <Button className="wide-button" variant="contained" onClick={handleClick}>Next</Button>
      </Box>

    </div>
  );
};

export { FormOne };
