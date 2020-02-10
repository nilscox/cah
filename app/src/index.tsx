import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as serviceWorker from './serviceWorker';

import App from './App';

import en from './locals/en';
import fr from './locals/fr';

import 'react-toastify/dist/ReactToastify.min.css';
import './styles.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.API_URL;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: 'fr',
    fallbackLng: 'fr',
  });

ReactDOM.render(<App />, document.getElementById('app'));

serviceWorker.unregister();
