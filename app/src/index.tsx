import React from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import App from './App';

import 'react-toastify/dist/ReactToastify.min.css';
import './styles.css';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4242';

ReactDOM.render(<App />, document.getElementById('app'));
