import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import App from './App';

import 'react-toastify/dist/ReactToastify.min.css';
import './styles.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.API_URL;

ReactDOM.render(<App />, document.getElementById('app'));
