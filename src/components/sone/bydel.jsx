import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Bydel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            bydel: {},
            url: ''
        };
    }

    async componentDidMount() {
        await this.hentBydel();
    }

    async hentBydel() {
        this.setState({
            bydel: await finnSoner(this.props.adresse, 'finnbydel')
        });
        this.state.url = "https://kart.trondheim.kommune.no/map/helse_oms/#13/" + this.state.bydel.geoml + "/" + this.state.bydel.geomb + "/topo_graa-bydel";
    }

    render() {
        const { bydel, url } = this.state;

        return (bydel.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top">
                    <h4 className="senter">
                        {bydel.bydelnavn}
                    </h4>
                </div>

                {/* <div>
                    <iframe height="500px" width="100%" title="Kart" src={url}></iframe>
                </div> */}
            </>
        )
    }
}