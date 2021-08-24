import React from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import App from '../App';
import '../components/sone/customStyle.css';
import Barnehage from '../components/sone/barnehage';
import Bydel from '../components/sone/bydel';
import Kirkesogn from '../components/sone/kirkesogn';
import Helsestasjon from '../components/sone/helsestasjon';
import Omsorgssone from '../components/sone/omsorgssone';
import Skole from '../components/sone/skole';
import Tommekalender from '../components/sone/tommekalender';

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(
  <App
    renderChildren={(adresse, altAdresse) => (
        <>
            <Barnehage adresse={adresse} altAdresse={altAdresse}  />
            <Bydel adresse={adresse} altAdresse={altAdresse}  />
            <Kirkesogn adresse={adresse} altAdresse={altAdresse}  />
            <Helsestasjon adresse={adresse} altAdresse={altAdresse}  />
            <Omsorgssone adresse={adresse} altAdresse={altAdresse}  />
            <Skole adresse={adresse} altAdresse={altAdresse}  />
            <Tommekalender adresse={adresse} altAdresse={altAdresse}  />
        </>
    )}
  />,
  document.getElementById('tk-alle')
);
