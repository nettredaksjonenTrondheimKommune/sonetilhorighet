import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Bydel from '../components/sone/bydel';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={(adresse) => (
      <Bydel adresse={adresse} />
    )}
  />,
  document.getElementById('tk-bydel'),
);
