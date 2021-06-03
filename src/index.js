import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import Helsestasjon from './components/sone/helsestasjon';
import Bydel from './components/sone/bydel';
import Omsorgssone from './components/sone/omsorgssone';

ReactDOM.render(
    <App
        renderChildren={(adresse, altAdresse) => (
            <>
                <Helsestasjon adresse={adresse} altAdresse={altAdresse} />

                <Bydel adresse={adresse} altAdresse={altAdresse} />

                <Omsorgssone adresse={adresse} altAdresse={altAdresse} />
            </>
        )}
    
    />,
    document.getElementById('root')
);