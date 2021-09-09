import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Bydel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            bydel: {}
        };
    }

    async componentDidMount() {
        await this.hentBydel();
    }

    async hentBydel() {
        this.setState({
            bydel: await finnSoner(this.props.adresse, this.props.altAdresse, 'finnbydel')
        });
    }

    render() {
        const { bydel } = this.state;

        return (bydel.length === 0
            ? <div className="box bg-blue margin-top text-center"><h4>Vi finner ingen bydel som hører til denne adressen!</h4></div>
            :
            <div className="box bg-blue margin-top text-center">
                <h3>Bydel</h3>
                {bydel.bydelnavn ? <p>{bydel.bydelnavn}</p> : ''}
            </div>
        )
    }
}