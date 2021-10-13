import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Bilpooltesten from '../components/annet/bilpooltesten';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={() => (
      <Bilpooltesten  />
    )}
  />,
  document.getElementById('tk-bilpooltesten'),
);
