import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Helsestasjon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            helsestasjon: {}
        };
    }

    async componentDidMount() {
        await this.hentHelsestasjon();
    }

    async hentHelsestasjon() {
        this.state.adresse = this.props.adresse.split(/(?<=[0-9])(?=[A-Za-z])/).join(" ");

        this.setState({
            helsestasjon: await finnSoner(this.state.adresse, 'finnhelsestasjon')
        });
        this.state.url = "https://kart.trondheim.kommune.no/map/helse_oms/#13/" + this.state.helsestasjon.geoml + "/" + this.state.helsestasjon.geomb + "/topo_graa-helsestasjonsone";
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

                {/* <div>
                    <iframe height="500px" width="500px" title="Kart" src="https://kart.trondheim.kommune.no/map/helse_oms/#11/63.4200/10.3999/topo_graa-helsestasjonsone"></iframe>
                </div> */}
            </>
        )
    }
}