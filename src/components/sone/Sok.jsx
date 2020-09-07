import React, { Component } from 'react';
import Sonetilhorighet from './Sonetilhorighet';
import finnSoner from '../../service/tk-geoapi.js';
import translations from './translations.json';
import getTranslate from '../../service/translate';

const defaultState = {
    results: [],
};
class Sok extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState,
            adresse: '',
            test: "Test",
            results: [{ navn: "helsestasjon", verdi: "Falkenborg helsestasjon", lenke: "https://trondheim.kommune.no/falkenborg-helsestasjon" }]
        }

        this.updateSoner = this.updateSoner.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this._ismounted = true;
        // this.updateSoner(this.props.adresse);
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    componentWillReceiveProps(nextProps) {
        const { adresse } = this.props;
        if (nextProps.adresse !== adresse) {
            this.setState({ ...defaultState });
            this.updateSoner(nextProps.adresse);
        }
    }

    updateSoner(adresse) {
        const { dispatch } = this.props;

        finnSoner(adresse, dispatch)
            .then(response => {
                this._ismounted && this.setState({ results: response.data })
            });
        this.state.results = [{ navn: "helsestasjon", verdi: "Falkenborg helsestasjon", lenke: "https://trondheim.kommune.no/falkenborg-helsestasjon" }]
        console.log(this.state.results[0].navn);
        // console.log(this.state.results[0].verdi);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.adresse = event.target.adresse.value;
        // this.updateSoner(this.adresse);
    }

    render() {
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
                        <div className="form-group">
                            <button className="btn btn-success" type="submit" aria-label="Søk">Søk</button>
                        </div>
                        {/* <Sonetilhorighet results={this.state.results} /> */}
                    </form>
                </div>

                <div className="box bg-blue">
                    <h4>
                        <a className="underline" href={this.state.results[0].lenke}>{this.state.results[0].verdi}</a>
                    </h4>


                    {/* {this.state.results &&
                        this.state.results.map((result, index) => {
                            return (
                                <div key={index}>
                                    <div>
                                        <p>{result.navn}</p>
                                        <p>{result.verdi}</p>
                                        <p>{result.lenke}</p>
                                    </div>
                                </div>
                            );
                        })} */}
                </div>
            </div>
        )
    }
}

export default Sok