import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Skole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            skole: {
                "barneskolekrets": "",
                "lenkeBarneskole": "",
                "ungdomskolekrets": "",
                "lenkeUngdomskole": ""
            }
        };
    }

    async componentDidMount() {
        await this.hentBarnskole();
    }

    async hentBarnskole() {
        this.setState({
            skole: await finnSoner(this.props.adresse, this.props.altAdresse, 'adresserkretser')
        });
    }

    render() {
        const { skole } = this.state;

        return (skole.length === 0
            ? <div className="box bg-blue text-center"><h4>Vi finner ingen skoler som hører til denne adressen!</h4></div>
            :
            <div className="box bg-blue">
                <h3>Skoler</h3>
                {skole.barneskolekrets ? <p className="text-capitalize">Barneskole: <a href={skole.lenkeBarneskole}>{skole.barneskolekrets}</a></p> : ''}
                {skole.ungdomskolekrets ? <p className="text-capitalize">Ungdomskole: <a href={skole.lenkeUngdomskole}>{skole.ungdomskolekrets}</a></p> : ''}
            </div>
        )
    }
}