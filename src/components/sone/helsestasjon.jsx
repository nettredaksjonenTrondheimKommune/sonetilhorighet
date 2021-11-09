import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Helsestasjon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            helsestasjon: {
                "helsestasjonsonenavn": "",
                "lenke": "",
                "telefon": "",
                "epost": "",
                "epostTil": "",
                "epostJordmor": "",
                "epostJordmorTil": "",
                "helsestasjonBesoksadresse": "",
                "jordmorBesoksadresse": ""
            }
        };
    }

    async componentDidMount() {
        await this.hentHelsestasjon();
    }

    async hentHelsestasjon() {
        this.setState({
            helsestasjon: await finnSoner(this.props.adresse, this.props.altAdresse, 'finnhelsestasjon')
        });
    }

    render() {
        const helsestasjon = this.state.helsestasjon;

        return (typeof helsestasjon.helsestasjonsonenavn === 'undefined'
            ? <div className="box bg-blue text-center"><h4>Vi finner ingen helsestasjon som hører til denne adressen!</h4></div>
            :
            <div className="box bg-blue">
                <h3>Helsestasjon</h3>
                <h4>Kontaktinformasjon</h4>
                {helsestasjon.helsestasjonsonenavn ? <p><a href={helsestasjon.lenke}>{helsestasjon.helsestasjonsonenavn}</a></p> : ''}
                {helsestasjon.telefon ? <p>Telefon: <a href={helsestasjon.telefon}>{helsestasjon.telefon}</a></p> : ''}
                {helsestasjon.epost ? <p>E-post helsestasjon (0-6 år): <a href={helsestasjon.epostTil}>{helsestasjon.epost}</a></p> : ''}
                {helsestasjon.helsestasjonBesoksadresse ? <p>Besøksadresse helsestasjon (0-6 år): {helsestasjon.helsestasjonBesoksadresse}</p> : ''}
                {helsestasjon.epostJordmor ? <p>E-post jordmor: <a href={helsestasjon.epostJordmorTil}>{helsestasjon.epostJordmor}</a></p> : ''}
                {helsestasjon.jordmorBesoksadresse ? <p>Besøksadresse jordmor: {helsestasjon.jordmorBesoksadresse}</p> : ''}
            </div>
        )
    }
}