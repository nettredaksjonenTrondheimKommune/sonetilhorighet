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
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top senter">
                    <h3>Kontaktinformasjon</h3>
                    {helsestasjon.infoBFT ? <p><a className="understrek" href={helsestasjon.lenkeBFT}>{helsestasjon.infoBFT}</a> eller ring <a className="understrek" href={helsestasjon.telefonnummerBFT}>{helsestasjon.telefonnummerBFT}</a></p> : ''}
                    {helsestasjon.helsestasjonsonenavn ? <p><a className="understrek" href={helsestasjon.lenke}>{helsestasjon.helsestasjonsonenavn}</a></p> : ''}
                    {helsestasjon.telefon ? <p>Telefon: <a className="understrek" href={helsestasjon.telefon}>{helsestasjon.telefon}</a></p> : ''}
                    {helsestasjon.epost ? <p>Epost: <a className="understrek" href={helsestasjon.epostTil}>{helsestasjon.epost}</a></p> : ''}
                    {helsestasjon.helsestasjonBesoksadresse ? <p><strong>Besøksadresse</strong><br />{helsestasjon.helsestasjonBesoksadresse}</p> : ''}
                </div>
            </>
        )
    }
}