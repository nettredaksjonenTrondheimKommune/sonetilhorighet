import React, { Component } from 'react';
import './App.css';
import './components/sone/customStyle.css';
import Autosuggest from 'react-autosuggest';
import alleAdresser from './service/alleAdresser.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      adresseforslag: [],
      ingenAdresseforslag: false,
      adresse: '',
      altAdresse: '',
      visResultat: false,
      alleAdresser: [],
      litenListe: []
    };
  }

  async componentDidMount() {

  }

  litenListeMedAdresser(liste) {
      let litenListe = [];

      if(liste.length > 5) {
          for (var i = 0; i < 5; i++) {
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

  finnAdresserSomStarterMed(adresseListe, key, adresse) {
    var forventetVerdi = this.forventetRegexSymbol(adresse.trim());
    forventetVerdi = forventetVerdi.toLowerCase();
    // const regex = new RegExp('^' + forventetVerdi, 'i');

    var listeEtterSok = adresseListe.filter(liste => liste.lowerCaseAdresse.startsWith(forventetVerdi));

    this.litenListe = this.litenListeMedAdresser(listeEtterSok);
    var listeMedFem = this.litenListe.map(liste => liste.adresse);

    return listeMedFem;
  }

  getSuggestionValue = forslag => forslag;

  renderSuggestion = forslag => (
    <span>{forslag}</span>
  );

  onSuggestionSelected = async (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    var alt = '';
    for (var i = 0; i < this.litenListe.length; i++) {
      if (this.litenListe[i].adresse === suggestionValue) {
        alt = this.litenListe[i].orginalAdresse;
      }
    }

    this.setState({
      adresse: suggestionValue,
      altAdresse: alt,
      visResultat: true
    });
  };

  onChange = (event, { newValue, method }) => {
    this.setState({
      visResultat: false,
      value: newValue
    });
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    const adresseforslag =  this.finnAdresserSomStarterMed(alleAdresser, "adresse", value);
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
    const { renderChildren } = this.props;
    const { value, adresseforslag, ingenAdresseforslag, adresse, altAdresse, visResultat } = this.state;
    const inputProps = {
      placeholder: "Skriv inn adresse",
      value,
      'aria-label': "S??k",
      'id': "adressesok",
      onChange: this.onChange
    };

    return (
      <div className="content">
        <div className="boks bla-boks">
          <label htmlFor="adressesok">S??k opp via adressen din</label>
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
          visResultat && renderChildren(adresse, altAdresse)
        }
        {/* {
          renderChildren()
        } */}
      </div>
    );
  }
}

export default App;