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

        if(this.state.bydel.length === 0) {
            this.state.adresse = this.props.adresse.replace(/(?<=[0-9])(?=[A-Za-z])/).slice(0, this.props.adresse.length-1);
            
            this.setState({
                bydel: await finnSoner(this.props.adresse, this.props.altAdresse, 'finnbydel')
            });
        }
    }

    render() {
        const { bydel } = this.state;

        return (bydel.length === 0
            ? <div className="boks bla-boks margin-top text-center"><h4>Vi finner ingen bydel som hører til denne adressen!</h4></div>
            :
            <>
                <div className="boks bla-boks margin-top text-center">
                    <h3>Bydel</h3>
                    {bydel.bydelnavn ? <p>{bydel.bydelnavn}</p> : ''}
                </div>
            </>
        )
    }
}