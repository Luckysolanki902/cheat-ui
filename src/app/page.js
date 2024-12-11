// src/app/page.js

'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
  Typography,
  Container,
  Box,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const HomePage = () => {
  const { username, login, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [inputUsername, setInputUsername] = useState('');
  const [copyPaste, setCopyPaste] = useState(false);

  useState(() => {
    if (username) {
      // Fetch user preferences
      fetchPreferences();
    }
  }, [username]);

  const fetchPreferences = async () => {
    try {
      const res = await axios.get('/api/preferences');
      if (res.data.preferences) {
        setCopyPaste(res.data.preferences.copy_paste);
      }
    } catch (error) {
      console.error('Fetch Preferences Error:', error);
    }
  };

  const handleLogin = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginSubmit = async () => {
    if (inputUsername.trim() === '') {
      alert('Username cannot be empty.');
      return;
    }
    await login(inputUsername.trim());
    setInputUsername('');
    setOpen(false);
  };

  const handleToggle = async (event) => {
    const newValue = event.target.checked;
    setCopyPaste(newValue);
    try {
      await axios.post('/api/preferences', { preferences: { copy_paste: newValue } });
    } catch (error) {
      console.error('Update Preferences Error:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!username) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={10}>
          <Typography variant="h4" gutterBottom>
            Welcome to Preferences App
          </Typography>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              variant="standard"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleLoginSubmit}>Login</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <Typography variant="h4" gutterBottom>
          Hello, {username}!
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={copyPaste}
              onChange={handleToggle}
              name="copyPaste"
              color="primary"
            />
          }
          label="CopyPaste"
        />
        <Box mt={4}>
          <Button variant="outlined" color="secondary" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
