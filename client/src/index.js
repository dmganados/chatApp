import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './pages/register/register.css';
import './pages/login/login.css';
import './pages/chat/chat.css';
import './components/contacts/contacts.css';
import './components/chat/chat.css';
import './pages/profile/profile.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>  
);


