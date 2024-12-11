// src/app/layout.js

'use client';

import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <title>Preferences App</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <body>
        <AuthProvider>
          <CssBaseline />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
