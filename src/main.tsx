import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import { SpeechProvider } from './context/SpeechContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <SpeechProvider>
        <App />
      </SpeechProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
