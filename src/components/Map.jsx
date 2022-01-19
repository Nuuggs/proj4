import React, { useState } from 'react';
import { TextField } from '@mui/material';
import {
  GoogleMap,
  useLoadScript,
  Autocomplete,
} from '@react-google-maps/api';

const axios = require('axios');

const libraries = ['places'];
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
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
    // Axios call here?
    const fetchPlaceConfig = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=2000&type=restaurant&keyword=chinese`,
      headers: { },
    };
    axios(fetchPlaceConfig).then((response) => {
      console.log(JSON.stringify(response.data));
    })
      .catch((error) => {
        console.log(error);
      });
    // const fetchPlace = axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=2000&type=restaurant&keyword=western`).then((res) => { console.log(res);

    console.log(coordinates);
  };

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading maps';
  return (
    <div className="map">
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <TextField sx={{ mt: 2, mb: 1, width: '300px' }} id="standard-basic" label="Search" variant="standard" />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={coordinates}
      />
    </div>

  );
};

export { Map };
