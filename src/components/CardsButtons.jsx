import React, { useState, useEffect } from 'react';
import '../styles.scss';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CardsButtons = () => (

  <div className="cardsButtons">
    <IconButton className="swipeButtons__left">
      <CloseIcon fontSize="large" />
    </IconButton>
    <IconButton className="swipeButtons__right">
      <FavoriteIcon fontSize="large" />
    </IconButton>
  </div>

);

export default CardsButtons;
