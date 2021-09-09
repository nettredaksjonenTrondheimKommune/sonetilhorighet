import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Kirkesogn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            kirkesogn: {}
        };
    }

    async componentDidMount() {
        await this.hentKirkesogn();
    }

    async hentKirkesogn() {
        this.setState({
            kirkesogn: await finnSoner(this.props.adresse, this.props.altAdresse, 'adresserkretser')
        });
    }

    render() {
        const { kirkesogn } = this.state;

        return (kirkesogn.length === 0
            ? <div className="box bg-blue margin-top text-center"><h4>Vi finner ingen kirkesogn som hører til denne adressen!</h4></div>
            :
            <div className="box bg-blue margin-top text-center">
                <h3>Kirkesogn</h3>
                <h4>Kontaktinformasjon</h4>
                {kirkesogn.kirkesogn ? <p>{kirkesogn.kirkesogn}</p> : ''}
            </div>
        )
    }
}