import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Ajouter le favicon
const link = document.createElement('link');
link.rel = 'icon';
link.href = '/favicon.ico';
document.head.appendChild(link);
