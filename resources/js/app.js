import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routing } from './routing/Routing';
import Navigation from './components/Navigation';
import { getSerials } from './store/serials.slice';
import axios from 'axios';
import prefixPAth from './constants/api';

axios.defaults.baseURL = prefixPAth;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';


axios.defaults.withCredentials = true;

axios.interceptors.request.use(function (config){
  const token = localStorage.getItem('auth_token');
  config.headers.Authorisation = token ? `Bearer ${token}` : '';
  return config;
})


export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSerials());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Navigation />
        <Routing />
      </Router>
    </>
  );
}
