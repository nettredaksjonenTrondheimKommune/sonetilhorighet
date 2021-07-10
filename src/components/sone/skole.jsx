import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Skole extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            altAdresse: '',
            skole: {}
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
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top text-center">
                    <h3>Skoler</h3>
                    {skole.barneskolekrets ? <p className="text-capitalize">Barneskole: <a href={skole.lenkeBarneskole}>{skole.barneskolekrets}</a></p> : ''}
                    {skole.ungdomskolekrets ? <p className="text-capitalize">Ungdomskole: <a href={skole.lenkeUngdomskole}>{skole.ungdomskolekrets}</a></p> : ''}
                </div>
            </>
        )
    }
}