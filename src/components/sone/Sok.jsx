import React, { Component } from 'react';
import Sonetilhorighet from './Sonetilhorighet';
import finnSoner from '../../service/tk-geoapi.js';
import translations from './translations.json';
import getTranslate from '../../service/translate';

const defaultState = {
    results: [],
    udefinert: ''
};
class Sok extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState,
            adresse: '',
            // results: [{ navn: "helsestasjon", verdi: "Falkenborg helsestasjon", lenke: "https://trondheim.kommune.no/falkenborg-helsestasjon" }]
        }

        this.updateSoner = this.updateSoner.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // componentDidMount() {
    //     this._ismounted = true;
    //     this.updateSoner(this.props.adresse);
    // }

    // componentWillUnmount() {
    //     this._ismounted = false;
    // }

    // componentWillReceiveProps(nextProps) {
    //     const { adresse } = this.props;
    //     if (nextProps.adresse !== adresse) {
    //         this.setState({ ...defaultState });
    //         this.updateSoner(nextProps.adresse);
    //     }
    // }

    async updateSoner(adresse) {
        const { dispatch } = this.props;

        const response = await finnSoner(adresse, dispatch);
        console.log(response);
        if (typeof response !== 'undefined') {
            this.state.results = response[0];
            console.log(this.state.results);
        } else {
            this.state.udefinert = "Adressen finnes ikke!";
            console.log(this.state.udefinert);
        }

        // this.state.results = [{ navn: "helsestasjon", verdi: "Falkenborg helsestasjon", lenke: "https://trondheim.kommune.no/falkenborg-helsestasjon" }]
        // console.log(this.state.results[0].verdi);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.adresse = event.target.adresse.value;
        this.updateSoner(this.adresse);
    }

    render() {
        const { results } = this.state;
        let foo;
        if (this.state.results !== 0) {
            foo = <a className="underline" href={this.state.results.lenke}>{this.state.results.verdi}</a>
        } else {
            foo = <span>Adressen finnes ikke!</span>
        }

        return (
            <div className="content">
                <div>
                    <h3>Finn din helsestasjon</h3>
                    <form className="form-inline" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input
                                className="form-control"
                                aria-label="Søk etter helsestasjon"
                                type="text"
                                name="adresse"
                                placeholder="Søk etter helsestasjon"
                                ref={node => (this.inputNode = node)}
                            />
                        </div>
                        <div className="form-group knapp">
                            <button className="btn" type="submit" aria-label="Søk">Søk</button>
                        </div>
                    </form>
                </div>

                <div className="box bg-blue">
                    <h3>Hei</h3>
                    <h4>
                        <a className="underline" href={this.state.results.lenke}>{this.state.results.verdi}</a>
                    </h4>
                </div>

                {/* <Sonetilhorighet lenke={this.state.results.lenke} verdi={this.state.results.verdi} /> */}
            </div>
        )
    }
}

export default Sok