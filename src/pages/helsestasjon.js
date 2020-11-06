import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Helsestasjon from '../components/sone/helsestasjon';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={(adresse) => (
      <Helsestasjon adresse={adresse} />
    )}
  />,
  document.getElementById('tk-helsestasjon'),
);