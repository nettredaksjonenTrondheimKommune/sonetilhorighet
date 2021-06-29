import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Skole from '../components/sone/skole';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={(adresse, altAdresse) => (
      <Skole adresse={adresse} altAdresse={altAdresse}  />
    )}
  />,
  document.getElementById('tk-skole'),
);
