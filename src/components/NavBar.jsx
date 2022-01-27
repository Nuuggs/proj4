import React, { useState } from 'react';
import {
  Box, Alert, BottomNavigation, BottomNavigationAction,
} from '@mui/material';

// import RestoreIcon from '@mui/icons-material/Restore';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import KebabDiningIcon from '@mui/icons-material/KebabDining';

export default function Navigation({
  setAppState, appState, setSessionId, setSessionType,
}) {
  const logoutClick = () => {
    localStorage.clear();
    setSessionId(null);
    // Reset session type upon logout
    setSessionType('');
    console.log('user logged out');
  };
  return (

    <div className="center-box">
      <Box sx={{ width: 280, mt: 2 }}>
        <BottomNavigation
          sx={{ borderRadius: 16 }}
          showLabels
          value={appState}
          onChange={(event, newValue) => {
            console.log(newValue);
            setAppState(newValue);
          }}
        >
          <BottomNavigationAction label="Logout" icon={<LogoutIcon />} value="landing" onClick={logoutClick} />
          <BottomNavigationAction label="Friends" icon={<GroupIcon />} value="friends" />
          <BottomNavigationAction label="Session" icon={<KebabDiningIcon />} value="session" />
        </BottomNavigation>
      </Box>
    </div>

  );
}
