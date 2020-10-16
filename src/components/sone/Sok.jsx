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
            ingenAdresseforslag: false,
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

    escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    finnAdresserSomStarterMed(liste, key, adresse) {
        var forventetVerdi = this.escapeRegexCharacters(adresse.trim());
        forventetVerdi = forventetVerdi.toLowerCase();
        const regex = new RegExp('^' + forventetVerdi, 'i');

        liste = liste.filter(res => regex.test(res.adresse));
        var litenListe = [];
        litenListe = this.litenListe(liste);

        return litenListe;
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
        if(newValue === '') {
            this.setState({
                visHelsestasjon: false
            });
        }
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = async ({ value }) => {
        const adresseforslag =  this.finnAdresserSomStarterMed(this.state.alleAdresser, "adresse", value);
        const isInputBlank = value.trim() === '';
        const ingenAdresseforslag = !isInputBlank && adresseforslag.length === 0;

        this.setState({
            adresseforslag,
            ingenAdresseforslag
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            adresseforslag: []
        });
    };

    render() {
        const { value, adresseforslag, ingenAdresseforslag, info, visHelsestasjon } = this.state;

        const inputProps = {
            placeholder: "Skriv inn adresse",
            value,
            'aria-label': "Søk etter helsestasjon",
            onChange: this.onChange
        };

        return (
            <div className="content">
                <div className="form-inline boks bla-boks">
                    <Autosuggest
                        suggestions={adresseforslag}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        inputProps={inputProps}
                    />

                    {
                        ingenAdresseforslag &&
                        <div className="no-suggestions">
                            Vi finner ikke adressen
                        </div>
                    }
                </div>

                {
                    visHelsestasjon &&
                    <div className="boks bla-boks">
                        <h4 className="senter">
                            <a className="understrek" href={info.lenke}>{info.helsestasjonsonenavn}</a>
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