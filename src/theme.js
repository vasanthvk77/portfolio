import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#08080f', paper: 'rgba(255,255,255,0.03)' },
    primary: { main: '#8b5cf6' },
    secondary: { main: '#06b6d4' },
    text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.55)' },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    allVariants: {
      letterSpacing: '1px',
    },
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { background: '#08080f', overflowX: 'hidden' },
        '.section-title': {
          position: 'relative',
          display: 'inline-block',
          paddingBottom: '12px',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '45px',
            height: '3.5px',
            borderRadius: '2px',
            background: 'linear-gradient(90deg, #ec4899, #06b6d4)',
            boxShadow: '0 0 10px rgba(236, 72, 153, 0.7)',
          }
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          '&:hover': {
            border: '1px solid rgba(139,92,246,0.35)',
            background: 'rgba(139,92,246,0.05)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: '10px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'rgba(139,92,246,0.1)',
          border: '1px solid rgba(139,92,246,0.25)',
          color: 'rgba(255,255,255,0.8)',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'transparent', boxShadow: 'none' },
      },
    },
  },
});

export default theme;
