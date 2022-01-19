import React, { useState } from 'react';
import LandingPage from './components/LandingPage.jsx';

import { PartnerChoice, RestaurantParameters } from './components/Form.jsx';
import { Map } from './components/Map.jsx';



export default function App() {
  // const [coordinates, setCoordinates] = useState({
  //   // Singapore's coordinates
  //   lat: 1.3521,
  //   lng: 103.8198,
  // });
  return (
    // <div>
    //   {/* <AutocompleteHeader coordinates={coordinates} setCoordinates={setCoordinates} /> */}
    //   <Map coordinates={coordinates} setCoordinates={setCoordinates} />
    // </div>

    <>
      <LandingPage />
    </>
  );
}
