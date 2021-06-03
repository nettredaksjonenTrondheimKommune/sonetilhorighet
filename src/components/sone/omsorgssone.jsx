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
        // this.state.url = "https://kart.trondheim.kommune.no/map/helse_oms/#13/" + this.state.omsorgssone.geoml + "/" + this.state.omsorgssone.geomb + "/topo_graa-helsestasjonsone";
    }

    render() {
        const { omsorgssone } = this.state;

        return (omsorgssone.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top senter">
                    <h3>Kontaktinformasjon</h3>
                    {omsorgssone.omsorgsone ? <p><a className="understrek" href={omsorgssone.lenke}>{omsorgssone.omsorgsone}</a></p> : ''}
                    {omsorgssone.telefon ? <p>Telefon: <a className="understrek" href={omsorgssone.telefon}>{omsorgssone.telefon}</a></p> : ''}
                    {omsorgssone.epost ? <p>Epost: <a className="understrek" href={omsorgssone.epostTil}>{omsorgssone.epost}</a></p> : ''}
                    {omsorgssone.hjemmetjenesteBesoksadresse ? <p><strong>Besøksadresse</strong><br />{omsorgssone.hjemmetjenesteBesoksadresse}</p> : ''}
                </div>

                {/* <div>
                    <iframe height="500px" width="500px" title="Kart" src="https://kart.trondheim.kommune.no/map/helse_oms/#11/63.4200/10.3999/topo_graa-helsestasjonsone"></iframe>
                </div> */}
            </>
        )
    }
}