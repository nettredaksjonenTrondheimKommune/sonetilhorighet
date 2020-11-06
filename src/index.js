import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import Helsestasjon from './components/sone/helsestasjon';
import Bydel from './components/sone/bydel';

ReactDOM.render(
    <App
        renderChildren={(adresse) => (
            <>
                <Helsestasjon adresse={adresse} />

                <Bydel adresse={adresse} />
            </>
        )}
    
    />,
    document.getElementById('root')
);