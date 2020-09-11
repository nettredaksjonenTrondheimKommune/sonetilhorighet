import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/styles.css';

import Sok from '../components/sone/Sok';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderHeader={() => (
      <></>
    )}
    renderChildren={(adresse) => (
      <Sok />
    )}
  />,
  document.getElementById('tk-sonetilhorighet'),
);
