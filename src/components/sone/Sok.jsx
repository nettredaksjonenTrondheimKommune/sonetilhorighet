import React, { Component } from 'react';
import PropTypes from 'prop-types';
import finnSoner from '../../service/tk-geoapi.js';
import translations from './translations.json';
import getTranslate from '../../service/translate';
import './customStyle.css';

const defaultState = {
    resultater: [],
    adresse: '',
    visHelsestasjon: false,
    visFinnerIkkeAdresse: false,
    finnerIkkeAdresse: ''
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
        const adresseLower = adresse.toLowerCase();
        this.setState({
            visHelsestasjon: false,
            visFinnerIkkeAdresse: false,
            finnerIkkeAdresse: ''
        });

        if (adresseLower === '') {
            return;
        }

        const { dispatch } = this.props;
        const response = await finnSoner(adresseLower, dispatch);
        console.log(response);

        if(response[0].adresse === adresseLower) {
            if(adresseLower === response[0].adresse) {
                this.state.resultater = response[0];
                this.setState({
                    visHelsestasjon: true
                });
            }
        } else if (response[0].adresse === "Vi finner ikke adressen du søker") {
            this.setState({
                visFinnerIkkeAdresse: true,
                finnerIkkeAdresse: response[0].adresse
            });
        } else {
            this.setState({
                visFinnerIkkeAdresse: true,
                finnerIkkeAdresse: response[0].adresse
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

        const knapp = {
            marginLeft: "20px",
            padding: "2px 20px",
            border: "3px solid #002c54",
            backgroundColor: "#dedede"
        };

        const underline = {
            textDecoration: "underline",
            color: "#055fa5"
        };

        const langInput = {
            paddingRight: "150px"
        };

        return (
            <div className="content">
                <form className="form-inline box bg-blue-light" onSubmit={this.handtereSok}>
                    <div className="form-group">
                        <input
                            className="form-control"
                            aria-label="Skriv inn gatenavn"
                            type="text"
                            name="adresse"
                            placeholder="Skriv inn gatenavn"
                            ref={node => (this.inputNode = node)}
                            style={langInput}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn" type="submit" style={knapp}>
                            Søk
                        </button>
                    </div>
                </form>

                {
                    this.state.visHelsestasjon &&
                    <div className="box bg-blue-light">
                        <h4>
                            <a style={underline} href={resultat.lenke}>{resultat.verdi}</a>
                        </h4>
                    </div>
                }

                {
                    this.state.visFinnerIkkeAdresse &&
                    <div className="box bg-blue-light">
                        <h4>
                            {this.state.finnerIkkeAdresse}
                        </h4>
                    </div>
                }
            </div>
        )
    }
}