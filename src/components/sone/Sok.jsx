import React, { Component } from 'react';
import PropTypes from 'prop-types';
import finnSoner from '../../service/tk-geoapi.js';
import translations from './translations.json';
import getTranslate from '../../service/translate';
import './customStyle.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { fetchJSON } from '../../service/fetchJSON.js';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import '../../../node_modules/react-bootstrap-typeahead/css/Typeahead.css';

const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse/finnhelsestasjon';
const PER_PAGE = 50;

async function hentAdresser(adresse) {
    const url = `${BASE_URL}/${encodeURIComponent(adresse)}`;

    return fetchJSON(url, { headers: AUTH_HEADER })
        .then((items, total_count) => {
            const alleAdresser = items.result.map((res, i = 0 + 1) => ({
                id: i,
                adresse: res.adresse,
                helsestasjonsonenavn: `${res.helsestasjonsonenavn} helsestasjon`,
                lenke: `https://trondheim.kommune.no/` + `${res.helsestasjonsonenavn} helsestasjon`
                    .toLowerCase()
                    .replace(/[^a-zæøå]/g, '-')
                    .replace(/æ/g, 'a')
                    .replace(/ø/g, 'o')
                    .replace(/å/g, 'a')
            }));
            console.log(alleAdresser);
            console.log(alleAdresser[0].adresse);
            console.log(adresse);
            const adresser = alleAdresser.map((res) => ({
                adresse: res.adresse
            }))
            console.log(adresser);
            return { alleAdresser, total_count };
        });
}

const defaultState = {
    resultater: [],
    // visHelsestasjon: false,
    visFinnerIkkeAdresse: false,
    finnerIkkeAdresse: '',
    // alleAdresser: [],
    // adresse: '',
    // isLoading: false,
};

export default class Sok extends Component {
    state = {
        ...defaultState,
        isLoading: false,
        alleAdresser: [],
        visHelsestasjon: false,
        adresse: ''
    }
    _cache = {};

    componentDidMount() {
        // await this.hentAdresser();
        // this._ismounted = true;
        // this.updateSoner(this.props.adresse);
    }

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

    async sokEtterHelsestasjon(adresse) {
        const adresseLower = adresse.toLowerCase();
        this.setState({
            visHelsestasjon: false,
            visFinnerIkkeAdresse: false,
            finnerIkkeAdresse: ''
        });

        if (adresseLower === '') {
            return;
        }

        const { dispatch } = this.props;
        const response = await finnSoner(adresseLower, dispatch);

        if(response[0].adresse === adresseLower) {
            if(adresseLower === response[0].adresse) {
                this.state.resultater = response[0];
                this.setState({
                    visHelsestasjon: true
                });
            }
        } else if (response[0].adresse === "Vi finner ikke adressen du søker") {
            this.setState({
                visFinnerIkkeAdresse: true,
                finnerIkkeAdresse: response[0].adresse
            });
        } else {
            this.setState({
                visFinnerIkkeAdresse: true,
                finnerIkkeAdresse: response[0].adresse
            });
        }
    };

    handtereSok = (event) => {
        event.preventDefault();
        this.adresse = event.target.adresse.value;
        this.sokEtterHelsestasjon(this.adresse);
    }

    _handleInputChange = adresse => {
        this.setState({ adresse });
    };

    _handlePagination = (e, shownResults) => {
        const { adresse } = this.state;
        const cachedQuery = this._cache[adresse];

        if (
            cachedQuery.alleAdresser.length > shownResults ||
            cachedQuery.alleAdresser.length === cachedQuery.total_count
        ) {
            return;
        }

        this.setState({ isLoading: true });

        const page = cachedQuery.page + 1;

        hentAdresser(adresse, page).then(resp => {
            const alleAdresser = cachedQuery.alleAdresser.concat(resp.alleAdresser);
            this._cache[adresse] = { ...cachedQuery, alleAdresser, page };
            this.setState({
                isLoading: false,
                alleAdresser
            });
        });
    };

    _handleSearch = adresse => {
        if (this._cache[adresse]) {
            this.setState({ alleAdresser: this._cache[adresse].alleAdresser });
            return;
        }

        this.setState({ isLoading: true });
        hentAdresser(adresse).then(resp => {
            this._cache[adresse] = { ...resp, page: 1 };
            this.setState({
                isLoading: false,
                alleAdresser: resp.alleAdresser
            });
        });
    };

    render() {
        const { resultater: resultat, alleAdresser: alleAdresser } = this.state;

        const knapp = {
            marginLeft: "20px",
            padding: "2px 20px",
            border: "3px solid #002c54",
            backgroundColor: "#dedede"
        };

        const underline = {
            textDecoration: "underline",
            color: "#055fa5"
        };

        const langInput = {
            paddingRight: "150px"
        };

        return (
            <div className="content">
                <div className="form-inline box bg-blue-light">
                    <AsyncTypeahead
                        {...this.state}
                        id="sokAdresse"
                        labelKey="adresse"
                        maxResults={PER_PAGE - 1}
                        minLength={1}
                        onInputChange={this._handleInputChange}
                        onPaginate={this._handlePagination}
                        onSearch={this._handleSearch}
                        options={alleAdresser}
                        paginate
                        placeholder="Skriv inn gatenavn"
                        align="justify"
                        renderMenuItemChildren={option => (
                            <React.Fragment>
                                <div key={option.id}>
                                    <span>{option.adresse}</span>
                                </div>
                            </React.Fragment>
                        )}
                        useCache={false}
                    />
                </div>

                {
                    this.state.visHelsestasjon &&
                    <div className="box bg-blue-light">
                        <h4>
                            <a style={underline} href={resultat.lenke}>{resultat.verdi}</a>
                        </h4>
                    </div>
                }

                {/* <form className="form-inline box bg-blue-light" onSubmit={this.handtereSok}>
                    <div className="form-group">
                        <input
                            className="form-control"
                            aria-label="Skriv inn gatenavn"
                            type="text"
                            name="adresse"
                            placeholder="Skriv inn gatenavn"
                            ref={node => (this.inputNode = node)}
                            style={langInput}
                        />
                    </div>
                    <div className="form-group">
                        <button className="btn" type="submit" style={knapp}>
                            Søk
                        </button>
                    </div>
                </form>

                {
                    this.state.visHelsestasjon &&
                    <div className="box bg-blue-light">
                        <h4>
                            <a style={underline} href={resultat.lenke}>{resultat.verdi}</a>
                        </h4>
                    </div>
                }

                {
                    this.state.visFinnerIkkeAdresse &&
                    <div className="box bg-blue-light">
                        <h4>
                            {this.state.finnerIkkeAdresse}
                        </h4>
                    </div>
                } */}
            </div>
        )
    }
}