import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Kirkesogn from '../components/sone/kirkesogn';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={(adresse, altAdresse) => (
      <Kirkesogn adresse={adresse} altAdresse={altAdresse} />
    )}
  />,
  document.getElementById('tk-kirkesogn'),
);