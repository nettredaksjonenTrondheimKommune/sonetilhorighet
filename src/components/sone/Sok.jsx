import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import finnSoner from '../../service/tk-geoapi.js';
// import translations from './translations.json';
// import getTranslate from '../../service/translate';
import './customStyle.css';
import { fetchJSON } from '../../service/fetchJSON.js';
import Autosuggest from 'react-autosuggest';

const AUTH_HEADER = {
    'X-API-KEY': 'oz4_500oOHb-vbI6ib8-nFlexij68-C-KOXEMkFALy4=',
};
const BASE_URL = 'https://kart.trondheim.kommune.no/tk-geoapi/api/v1/adresse';

export default class Sok extends Component {
    constructor() {
        super();

        this.state = {
            value: '',
            adresseforslag: [],
            info: {},
            visHelsestasjon: false,
            alleAdresser: []
        };
    }

    componentDidMount() {
        this.hentAdresser();
    }

    hentAdresser = async () => {
        const url = `${BASE_URL}/adresser?limit=55000`;
        const dokument = await fetchJSON(url, { headers: AUTH_HEADER });

        this.setState({
            alleAdresser: (dokument.result || []).map((res) => ({
                adresse: res.gatenavn + " " + res.husnr + res.bokstav,
                gatenavn: res.gatenavn
            }))
        });

        var sortertListe = [];

        for(var i = 0; i < this.state.alleAdresser.length; i++) {
            if(this.state.alleAdresser[i].gatenavn !== null) {
                sortertListe.push(this.state.alleAdresser[i]);
            }
        }

        this.setState({
            alleAdresser: sortertListe.sort((a, b) => a.adresse.localeCompare(b.adresse, undefined, { numeric: true, sensitivity: 'base' }))
        });
    }

    litenListe(liste) {
        let litenListe = [];
        if(liste.length > 10) {
            for (var j = 0; j < 10; j++) {
                litenListe.push(liste[j]);
            }
        } else {
            litenListe = liste;
        }

        return litenListe;
    }

    finnAdresserSomStarterMed(liste, key, adresse) {
        adresse = adresse[0].toUpperCase() + adresse.slice(1);

        if(!isNaN(adresse[adresse.length-2])) {
            adresse = adresse.slice(0, -1) + adresse.slice(-1).toUpperCase();
        }

        let starterMedListe = [];
        for(var i = 0; i < liste.length; i++) {
            if (liste[i][key].startsWith(adresse)) {
                starterMedListe.push(liste[i]);
            }
        }

        starterMedListe = this.litenListe(starterMedListe);

        return starterMedListe;
    }

    getSuggestions = async (value) => {
        const forventetVerdi = value.trim().toLowerCase();

        if (forventetVerdi === '') {
            return [];
        }

        const url = `${BASE_URL}/finnhelsestasjon/${encodeURIComponent(forventetVerdi)}`;
        const dokument = await fetchJSON(url, { headers: AUTH_HEADER });
        var adresseInfo = (dokument.result || []).map((res, i = 0 + 1) => ({
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

        adresseInfo = adresseInfo.find(({ adresse }) => adresse === value);

        return adresseInfo;
    }

    getSuggestionValue = suggestion => suggestion.adresse;

    renderSuggestion = suggestion => (
        <span>{suggestion.adresse}</span>
    );

    onSuggestionSelected = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
        this.setState({
            info: await this.getSuggestions(suggestionValue),
            visHelsestasjon: true
        });
    };

    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = async ({ value }) => {
        this.setState({
            adresseforslag: this.finnAdresserSomStarterMed(this.state.alleAdresser, "adresse", value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            adresseforslag: []
        });
    };

    render() {
        const { value, adresseforslag, info, visHelsestasjon } = this.state;

        const inputProps = {
            placeholder: "Skriv inn adresse",
            value,
            onChange: this.onChange
        };

        // const knapp = {
        //     marginLeft: "20px",
        //     padding: "2px 20px",
        //     border: "3px solid #002c54",
        //     backgroundColor: "#dedede"
        // };

        const underline = {
            textDecoration: "underline",
            color: "#055fa5"
        };

        return (
            <div className="content">
                <div className="form-inline box bg-blue-light">
                    <Autosuggest
                        suggestions={adresseforslag}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        inputProps={inputProps}
                    />
                </div>

                {
                    visHelsestasjon &&
                    <div className="box bg-blue-light">
                        <h4>
                            <a style={underline} href={info.lenke}>{info.helsestasjonsonenavn}</a>
                        </h4>
                    </div>
                }

                {/* <div>
                    <iframe height="500px" width="500px" title="Kart" src="https://kart.trondheim.kommune.no/map/helse_oms/#11/63.4200/10.3999/topo_graa-helsestasjonsone"></iframe>
                </div> */}
            </div>
        )
    }
}