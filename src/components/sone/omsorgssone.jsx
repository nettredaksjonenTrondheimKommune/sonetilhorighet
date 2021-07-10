import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Omsorgssone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            omsorgssone: {}
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

        return (omsorgssone.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top text-center">
                    <h3>Hjemmetjeneste</h3>
                    <h4>Kontaktinformasjon</h4>
                    {omsorgssone.omsorgsone ? <p><a className="understrek" href={omsorgssone.lenkeHjemmetjeneste}>{omsorgssone.omsorgsone}</a></p> : ''}
                    {omsorgssone.telefon ? <p>Telefon: <a className="understrek" href={omsorgssone.telefon}>{omsorgssone.telefon}</a></p> : ''}
                    {omsorgssone.epost ? <p>Epost: <a className="understrek" href={omsorgssone.epostTil}>{omsorgssone.epost}</a></p> : ''}
                    {omsorgssone.hjemmetjenesteBesoksadresse ? <p><strong>Besøksadresse</strong><br />{omsorgssone.hjemmetjenesteBesoksadresse}</p> : ''}
                </div>
            </>
        )
    }
}