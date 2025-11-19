import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Hospital blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#262D6F', // Your exact secondary color (rgb(38, 45, 111))
      light: '#3A4183',
      dark: '#1C235B',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    info: {
      main: '#94E1D8', // accent color
      light: '#0006FF', // flash color
    }
  },
  typography: {
    fontFamily: '"Avenir Next", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '1.875rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.625rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      '@media (min-width:600px)': {
        fontSize: '1.375rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      '@media (min-width:600px)': {
        fontSize: '1.1875rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.25rem',
      },
    },
    h6: {
      fontSize: '0.9375rem',
      fontWeight: 500,
      lineHeight: 1.6,
      '@media (min-width:600px)': {
        fontSize: '0.96875rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      '@media (min-width:600px)': {
        fontSize: '0.96875rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1rem',
      },
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
      '@media (min-width:600px)': {
        fontSize: '0.84375rem',
      },
      '@media (min-width:900px)': {
        fontSize: '0.875rem',
      },
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.65,
      fontWeight: 400,
      '@media (min-width:600px)': {
        fontSize: '1.0625rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.125rem',
      },
    },
    subtitle2: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      fontWeight: 500,
      '@media (min-width:600px)': {
        fontSize: '0.96875rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          },
          transition: 'box-shadow 0.3s ease-in-out',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          fontWeight: 500,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})




