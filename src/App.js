import React, { Component } from 'react';
import './App.css';
import './components/sone/customStyle.css';
import Autosuggest from 'react-autosuggest';
import hentAlleAdresser from './service/hentAlleAdresser.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      adresseforslag: [],
      ingenAdresseforslag: false,
      adresse: '',
      visResultat: false,
      alleAdresser: []
    };
  }

  async componentDidMount() {
      this.state.alleAdresser = await hentAlleAdresser()
  }

  litenListeMedAdresser(liste) {
      let litenListe = [];

      if(liste.length > 10) {
          for (var i = 0; i < 10; i++) {
              litenListe.push(liste[i]);
          }
      } else {
          litenListe = liste;
      }

      return litenListe;
  }

  forventetRegexSymbol(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  finnAdresserSomStarterMed(liste, key, adresse) {
      var forventetVerdi = this.forventetRegexSymbol(adresse.trim());
      forventetVerdi = forventetVerdi.toLowerCase();
      const regex = new RegExp('^' + forventetVerdi, 'i');

      liste = liste.filter(res => regex.test(res.adresse));
      var litenListe = [];
      litenListe = this.litenListeMedAdresser(liste);

      return litenListe;
  }

  getSuggestionValue = forslag => forslag.adresse;

  renderSuggestion = forslag => (
    <span>{forslag.adresse}</span>
  );

  onSuggestionSelected = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
      this.setState({
        adresse: suggestionValue,
        visResultat: true
      });
  };

  onChange = (event, { newValue, method }) => {
      if(newValue === '') {
          this.setState({
            visResultat: false
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
    const { renderHeader, renderChildren } = this.props;
    const { value, adresseforslag, ingenAdresseforslag, adresse, visResultat } = this.state;
    const inputProps = {
      placeholder: "Skriv inn adresse",
      value,
      'aria-label': "Søk etter bydel",
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
          visResultat && renderChildren(adresse)
        }
      </div>
    );
  }
}

export default App;