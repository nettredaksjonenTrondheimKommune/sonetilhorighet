import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';

import Sok from '../components/sone/Sok';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderHeader={() => (
      <></>
    )}
    renderChildren={() => (
      <Sok />
    )}
  />,
  document.getElementById('tk-sonetilhorighet'),
);
