import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the GoogleOAuthProvider
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Wrap the App with GoogleOAuthProvider and provide the client ID */}
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
