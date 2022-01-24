import React, { useState } from 'react';

import LandingPage from './components/LandingPage.jsx';
import MainForm from './components/MainForm.jsx';
import RestaurantPage from './components/RestaurantCard.jsx';
import CardsButtons from './components/CardsButtons.jsx';

export default function App() {
  // Global states

  return (
    // <MainForm />
    <div>
      <RestaurantPage />
      <CardsButtons />
    </div>
  );
}
