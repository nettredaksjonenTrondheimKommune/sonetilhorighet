import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Sonetilhorighet from './Sonetilhorighet';
import finnSoner from '../../service/tk-geoapi.js';
import translations from './translations.json';
import getTranslate from '../../service/translate';

const defaultState = {
    resultater: [],
    adresse: '',
    udefinert: '',
    visHelsestasjon: false,
    visFinnerIkkeAdresse: false
};
export default class Sok extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState
        }

        this.updateSoner = this.sokEtterHelsestasjon.bind(this);
        this.handtereSok = this.handtereSok.bind(this);
    }

    // componentDidMount() {
    //     this._ismounted = true;
    //     this.updateSoner(this.props.adresse);
    // }

    // componentWillUnmount() {
    //     this._ismounted = false;
    // }

    // componentWillReceiveProps(nextProps) {
    //     const { adresse } = this.props;
    //     if (nextProps.adresse !== adresse) {
    //         this.setState({ ...defaultState });
    //         this.updateSoner(nextProps.adresse);
    //     }
    // }

    async sokEtterHelsestasjon(adresse) {
        this.setState({
            visHelsestasjon: false,
            visFinnerIkkeAdresse: false
        });
        if (adresse === '') {
            return;
        }

        const { dispatch } = this.props;
        const response = await finnSoner(adresse, dispatch);

        if (typeof response !== 'undefined') {
            this.state.resultater = response[0];
            this.setState({
                visHelsestasjon: true
            });
        } else {
            this.setState({
                visFinnerIkkeAdresse: true
            });
        }
    };

    handtereSok = (event) => {
        event.preventDefault();
        this.adresse = event.target.adresse.value;
        this.sokEtterHelsestasjon(this.adresse);
    }

    render() {
        const { resultater: resultat } = this.state;

        return (
            <div className="content">
                <div>
                    <h3>Finn din helsestasjon</h3>
                    <form className="form-inline" onSubmit={this.handtereSok}>
                        <div className="form-group">
                            <input
                                className="form-control langInput"
                                aria-label="Skriv inn gatenavn"
                                type="text"
                                name="adresse"
                                placeholder="Skriv inn gatenavn"
                                ref={node => (this.inputNode = node)} 
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn knapp" type="submit">Søk</button>
                        </div>
                    </form>
                </div>

                {
                    this.state.visHelsestasjon &&
                    <div className="box bg-blue-light">
                        <h4>
                            <a className="underline" href={resultat.lenke}>{resultat.verdi}</a>
                        </h4>
                    </div>
                }

                {
                    this.state.visFinnerIkkeAdresse &&
                    <div className="box bg-blue-light">
                        <h4>
                            Vi finner ikke adressen du søker etter. Har du for eksempel skrevet vei istedet for veg?
                        </h4>
                    </div>
                }
            </div>
        )
    }
}