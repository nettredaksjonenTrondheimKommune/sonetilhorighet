// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import finnSoner from '../../service/tk-geoapi.js';
// import translations from './translations.json';
// import getTranslate from '../../service/translate';

// const defaultState = {
//     soner: [],
// };
// export default class Sonetilhorighet extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { ...defaultState };
//     }

//     componentDidMount() {
//         this._ismounted = true;
//         this.updateSoner(this.props.adresse);
//     }

    // componentWillUnmount() {
    //     this._ismounted = false;
    // }

    // componentWillReceiveProps(nextProps) {
    //     const { adresse } = this.props;
    //     if (nextProps.adresse !== adresse) {
    //       this.setState({ ...defaultState });
    //       this.updateSoner(nextProps.adresse);
    //     }
    // }
    
//     updateSoner(adresse) {
//         const { dispatch } = this.props;

//         finnSoner(adresse, dispatch).then((soner) => this._ismounted && this.setState({ soner }));
//     };

//     render() {
//         const { soner } = this.state;
//         let translate = getTranslate(translations, this.props);

//         return (
//             <div className="center">
//                 <form className="input-group" method="get">
//                     <input type="text" className="form-control" placeholder="Skriv inn din adresse" />
//                     <button type="submit" className="btn" onClick={this.updateSoner("Hørløcks veg 4A")}>Søk</button>
//                 </form>
//                 <table className="table">
//                     {soner.map(sone => (
//                         <tbody key={sone.navn}>
//                             <SoneInformasjon key={sone.navn} sone={sone} translate={translate} />
//                         </tbody>
//                     ))}
//                 </table>
//             </div>
//         )
//     }
// }

// Sonetilhorighet.propTypes = {
//     adresse: PropTypes.string.isRequired,
//     translate: PropTypes.func,
//     dispatch: PropTypes.func,
// };

// function SoneInformasjon({ sone, translate }) {
//     console.log("Hei");
//     return (
//         sone && (
//             <tr>
//                 <th scope="row">{translate(`sonetilhorighet.${sone.navn}`)}</th>
//                 <td>{sone.verdi}</td>
//                 <td>{sone.lenke && (
//                     <button class="btn">
//                         <a href={sone.lenke}>{translate('sonetilhorighet.information-about', { value: sone.verdi })}</a>
//                     </button>
//                 )}</td>
//             </tr>
//         )
//     );
// }
  
// SoneInformasjon.propTypes = {
//     translate: PropTypes.func.isRequired,
//     sone: PropTypes.shape({
//         navn: PropTypes.string,
//         verdi: PropTypes.string,
//         lenke: PropTypes.string,
//     }).isRequired,
// };
 
import React from 'react'

const Sonetilhorighet = (props) => {
  const options = props.results.map(r => (
    <>
    <li key={r.navn}>
      {r.verdi}
    </li>
    </>
  ))
  return <ul>{options}</ul>
}

export default Sonetilhorighet