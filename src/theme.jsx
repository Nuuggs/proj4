import { createTheme } from '@mui/material/styles';

const mainTheme = createTheme(
  {
    palette: {
      type: 'light',
      primary: {
        main: '#51682b',
      },
      secondary: {
        main: '#e29426',
      },
      error: {
        main: '#f45636',
      },
    },
  },
);

export default mainTheme;
