import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import Helsestasjon from './components/sone/helsestasjon';
import Bydel from './components/sone/bydel';
import Omsorgssone from './components/sone/omsorgssone';
import Skole from './components/sone/skole';
import Barnehage from './components/sone/barnehage';
import Tommekalender from './components/sone/tommekalender';

ReactDOM.render(
    <App
        renderChildren={(adresse, altAdresse) => (
            <>
                <Helsestasjon adresse={adresse} altAdresse={altAdresse} />

                <Bydel adresse={adresse} altAdresse={altAdresse} />

                <Omsorgssone adresse={adresse} altAdresse={altAdresse} />

                <Skole adresse={adresse} altAdresse={altAdresse} />

                <Barnehage adresse={adresse} altAdresse={altAdresse} />

                <Tommekalender adresse={adresse} altAdresse={altAdresse} />
            </>
        )}
    
    />,
    document.getElementById('root')
);