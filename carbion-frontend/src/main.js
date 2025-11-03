import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import App from './calculadoraCarbono'; // Certifique-se de que 'App' é exportado corretamente do arquivo App.js

// Adaptando o React.createElement para uso em JS puro
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(
    StrictMode,
    null,
    React.createElement(App),
    React.createElement(SpeedInsights)
  )
);
