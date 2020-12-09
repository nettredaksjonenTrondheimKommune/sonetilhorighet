import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Omsorgssone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            omsorgsone: {}
        };
    }

    async componentDidMount() {
        await this.hentOmsorgssone();
    }

    async hentOmsorgssone() {
        this.state.adresse = this.props.adresse.split(/(?=[A-Z])/).join(" ");

        this.setState({
            omsorgsone: await finnSoner(this.state.adresse, 'adresserkretser')
        });
        this.state.url = "https://kart.trondheim.kommune.no/map/helse_oms/#13/" + this.state.omsorgsone.geoml + "/" + this.state.omsorgsone.geomb + "/topo_graa-helsestasjonsone";
    }

    render() {
        const { omsorgsone } = this.state;

        return (omsorgsone.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top">
                    <h4 className="senter">
                        <a className="understrek" href={omsorgsone.lenke}>{omsorgsone.omsorgsone}</a>
                    </h4>
                </div>

                {/* <div>
                    <iframe height="500px" width="500px" title="Kart" src="https://kart.trondheim.kommune.no/map/helse_oms/#11/63.4200/10.3999/topo_graa-helsestasjonsone"></iframe>
                </div> */}
            </>
        )
    }
}