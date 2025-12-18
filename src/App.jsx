import React, { useEffect, useState, useMemo } from 'react';
import { Box, CssBaseline, Grid, AppBar, Toolbar, Typography, Container, ThemeProvider, createTheme, IconButton, useMediaQuery } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import api from './api/axios';
import GenderTree from './components/GenderTree';
import ClientGrid from './components/ClientGrid';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'dark');
  const [genderList, setGenderList] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedAgeRange, setSelectedAgeRange] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' ? {

        primary: {
          main: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        background: {
          default: '#0F172A',
          paper: '#1E293B',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
        },
      } : {
        primary: {
          main: '#4F46E5',
          light: '#6366F1',
          dark: '#4338CA',
        },
        background: {
          default: '#F8FAFC',
          paper: '#FFFFFF',
        },
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
      }),
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      body1: {
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: mode === 'dark'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            border: mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(226, 232, 240, 0.8)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark'
              ? 'rgba(15, 23, 42, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: mode === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.1)'
              : '1px solid rgba(226, 232, 240, 1)',
            boxShadow: 'none',
            color: mode === 'dark' ? '#F1F5F9' : '#0F172A',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  }), [mode]);

  useEffect(() => {
    fetchGenderList();
  }, []);

  const fetchGenderList = async () => {
    try {
      const response = await api.get('/getGenderList');
      setGenderList(response.data);
    } catch (error) {
      console.error('Error fetching gender list:', error);
      toast.error('Failed to load gender data');
    }
  };

  const handleSelectAgeGroup = async (gender, low, high) => {
    setSelectedAgeRange({ low, high });
    setSelectedGender(gender);

    try {
      const response = await api.get('/getClientsForAge', {
        params: {
          lowAge: low,
          highAge: high,
          gender: gender
        }
      });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
        transition: 'background-color 0.3s ease'
      }}>
        <CssBaseline />
        <AppBar position="sticky" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>A</Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ color: 'text.primary' }}>
                Client<span style={{ color: theme.palette.primary.main }}>Dashboard</span>
              </Typography>
            </Box>

            <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth={false}
          sx={{
            flexGrow: 1,
            p: 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              flexGrow: 1,
              height: '100%',
              overflow: 'hidden',
              gap: 3
            }}
          >
            <Box sx={{
              width: { xs: '100%', md: 280 },
              height: { xs: 'auto', md: '100%' },
              flexShrink: 0,
              overflow: 'auto',
              maxHeight: { xs: '40%', md: '100%' },
              borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` },
              borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' },
              pr: { md: 2 },
              pb: { xs: 2, md: 0 },
              mb: { xs: 2, md: 0 }
            }}>
              <GenderTree
                genderList={genderList}
                selectedGender={selectedGender}
                selectedAgeRange={selectedAgeRange}
                onSelectAgeGroup={handleSelectAgeGroup}
              />
            </Box>

            <Box sx={{
              flexGrow: 1,
              height: { xs: 'auto', md: '100%' },
              overflow: 'hidden',
              minWidth: 0,
              flexBasis: { xs: '60%', md: 'auto' }
            }}>
              <ClientGrid
                clients={clients}
                selectedAgeRange={selectedAgeRange}
                selectedGender={selectedGender}
              />
            </Box>
          </Box>
        </Container>

        <ToastContainer position="bottom-right" theme={mode} toastStyle={{ backgroundColor: mode === 'dark' ? '#1E293B' : '#FFFFFF', color: mode === 'dark' ? '#F1F5F9' : '#0F172A' }} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
