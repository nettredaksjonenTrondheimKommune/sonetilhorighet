import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';

import SoneTilhorighet from '../components/sone/SoneTilhorighet';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderHeader={() => (
      <>
      <h1>Nærområde</h1>
      <h2>Finn sonetilhørighet for adresse</h2>
      </>
    )}
    renderChildren={(adresse) => (
      <>
        <h3>{adresse}</h3>

        <SoneTilhorighet adresse={adresse} />
      </>
    )}
  />,
  document.getElementById('tk-sonetilhorighet'),
);
