import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';
// import Select from 'react-select';

// const options = [
//     {
//         label: "- Ikke valgt -",
//         value: ""
//     },
//     {
//       label: "Heimdal",
//       value: "heimdal"
//     },
//     {
//       label: "Lerkendal",
//       value: "lerkendal"
//     },
//     {
//       label: "Midtbyen",
//       value: "midtbyen"
//     },
//     {
//       label: "Østbyen",
//       value: "østbyen"
//     }
// ];

export default class Bydel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            bydel: {},
            url: '',
            selectedOption: {
                label: "- Ikke valgt -",
                value: ""
            }
        };

        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange = selectedOption => {
        this.setState({ selectedOption });
    };

    async componentDidMount() {
        await this.hentBydel();
    }

    async hentBydel() {
        this.setState({
            bydel: await finnSoner(this.props.adresse, 'finnbydel')
        });
        this.state.url = "https://kart.trondheim.kommune.no/map/helse_oms/#13/" + this.state.bydel.geoml + "/" + this.state.bydel.geomb + "/topo_graa-bydel";
    }

    render() {
        const { bydel } = this.state;
        // const { bydel, url, selectedOption } = this.state;
        // const placeholder = "Velg en bydel";

        return (bydel.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top senter">
                    <h4>
                        {bydel.bydelnavn}
                    </h4>

                    {/* <label htmlFor="velgBydel">Hvilken bydel tilhører du?</label>
                    <Select
                        inputId="velgBydel"
                        value={selectedOption}
                        onChange={this.handleChange}
                        options={options}
                        placeholder={placeholder}
                    /> */}
                </div>

                {/* <div>
                    <iframe height="500px" width="100%" title="Kart" src={url}></iframe>
                </div> */}
            </>
        )
    }
}