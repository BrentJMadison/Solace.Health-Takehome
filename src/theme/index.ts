import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1d4238',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
      contrastText: '#1d4238',
    },
    background: {
      default: '#1d4238',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Lato, sans-serif',
    h1: {
      fontFamily: '"Mollie glaston", sans-serif',
      fontWeight: 600,
      color: '#1d4238',
    },
    h2: {
      fontFamily: '"Mollie glaston", sans-serif',
      fontWeight: 600,
      color: '#1d4238',
    },
    h3: {
      fontFamily: '"Mollie glaston", sans-serif',
      fontWeight: 600,
      color: '#1d4238',
    },
    h4: {
      fontFamily: '"Mollie glaston", sans-serif',
      fontWeight: 600,
      color: '#1d4238',
    },
    h5: {
      fontFamily: '"Mollie glaston", sans-serif',
      fontWeight: 600,
      color: '#1d4238',
    },
    h6: {
      fontFamily: '"Mollie glaston", sans-serif',
      fontWeight: 500,
      color: '#1d4238',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;