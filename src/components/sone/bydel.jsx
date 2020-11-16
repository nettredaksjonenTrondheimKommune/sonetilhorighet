import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Bydel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            bydel: {}
        };
    }

    async componentDidMount() {
        this.setState({
            bydel: await finnSoner(this.props.adresse, 'finnbydel')
        });
    }

    render() {
        const { bydel } = this.state;

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
                    <iframe height="500px" width="500px" title="Kart" src="https://kart.trondheim.kommune.no/map/helse_oms/#13/63.4147/10.4222/topo_graa-bydel"></iframe>
                </div> */}
            </>
        )
    }
}