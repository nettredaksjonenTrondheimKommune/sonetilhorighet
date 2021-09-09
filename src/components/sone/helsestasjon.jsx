import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Helsestasjon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            helsestasjon: {}
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
        const { helsestasjon } = this.state;

        return (helsestasjon.length === 0
            ? <div className="box bg-blue margin-top text-center"><h4>Vi finner ingen helsestasjon som hører til denne adressen!</h4></div>
            :
            <div className="box bg-blue margin-top text-center">
                <h3>Helsestasjon</h3>
                <h4>Kontaktinformasjon</h4>
                {helsestasjon.helsestasjonsonenavn ? <p><a href={helsestasjon.lenke}>{helsestasjon.helsestasjonsonenavn}</a></p> : ''}
                {helsestasjon.telefon ? <p>Telefon: <a href={helsestasjon.telefon}>{helsestasjon.telefon}</a></p> : ''}
                {helsestasjon.epost ? <p>Epost: <a href={helsestasjon.epostTil}>{helsestasjon.epost}</a></p> : ''}
                {helsestasjon.helsestasjonBesoksadresse ? <p><strong>Besøksadresse</strong><br />{helsestasjon.helsestasjonBesoksadresse}</p> : ''}
            </div>
        )
    }
}