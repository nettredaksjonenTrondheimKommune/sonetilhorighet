import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Omsorgssone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            omsorgssone: {
                "omsorgsone": "",
                "telefon": "",
                "epost": "",
                "hjemmetjenesteBesoksadresse": "",
                "lenkeHjemmetjeneste": "",
                "epostTil": ""
            }
        };
    }

    async componentDidMount() {
        await this.hentOmsorgssone();
    }

    async hentOmsorgssone() {
        this.setState({
            omsorgssone: await finnSoner(this.props.adresse, this.props.altAdresse, 'adresserkretser')
        });
    }

    render() {
        const { omsorgssone } = this.state;

        return (typeof omsorgssone.omsorgsone === 'undefined'
            ? <div className="box bg-blue text-center"><h4>Vi finner ingen hjemmetjeneste som hører til denne adressen!</h4></div>
            :
            <div className="box bg-blue">
                <h3>Hjemmetjeneste</h3>
                <h4>Kontaktinformasjon</h4>
                {omsorgssone.omsorgsone ? <p><a href={omsorgssone.lenkeHjemmetjeneste}>{omsorgssone.omsorgsone}</a></p> : ''}
                {omsorgssone.telefon ? <p>Telefon: <a href={omsorgssone.telefon}>{omsorgssone.telefon}</a></p> : ''}
                {omsorgssone.epost ? <p>Epost: <a href={omsorgssone.epostTil}>{omsorgssone.epost}</a></p> : ''}
                {omsorgssone.hjemmetjenesteBesoksadresse ? <p>Besøksadresse {omsorgssone.hjemmetjenesteBesoksadresse}</p> : ''}
            </div>
        )
    }
}