import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Tommekalender from '../components/sone/tommekalender';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={(adresse, altAdresse) => (
      <Tommekalender adresse={adresse} altAdresse={altAdresse}  />
    )}
  />,
  document.getElementById('tk-tommekalender'),
);