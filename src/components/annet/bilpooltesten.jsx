import React from 'react';

export default class Barnehage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dine_kostnader: 0,
            timer_kan_du_leie_bil: 0
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        document.getElementById('dine_kostnader').innerHTML = parseInt(this.state.dine_kostnader);
        document.getElementById('timer_kan_du_leie_bil').innerHTML = parseInt(this.state.timer_kan_du_leie_bil);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'number' ? target.value : target.value;
        const name = target.name;
        var aarlig_verditap = parseInt(document.getElementById('aarlig_verditap').value) ? parseInt(document.getElementById('aarlig_verditap').value) : 0;
        var forsikring = parseInt(document.getElementById('forsikring').value) ? parseInt(document.getElementById('forsikring').value) : 0;
        var bompenger = parseInt(document.getElementById('bompenger').value) ? parseInt(document.getElementById('bompenger').value) : 0;
        var drivstoff = parseInt(document.getElementById('drivstoff').value) ? parseInt(document.getElementById('drivstoff').value) : 0;
        var vask = parseInt(document.getElementById('vask').value) ? parseInt(document.getElementById('vask').value) : 0;
        var service = parseInt(document.getElementById('service').value) ? parseInt(document.getElementById('service').value) : 0;
        var dine_kostnader = aarlig_verditap + forsikring + bompenger + drivstoff + vask + service;
        document.getElementById('dine_kostnader').innerHTML = parseInt(dine_kostnader);
        var timer_kan_du_leie_bil = parseInt(dine_kostnader / 100);
        document.getElementById('timer_kan_du_leie_bil').innerHTML = parseInt(timer_kan_du_leie_bil);
        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <>
                <p>Hvor mange timer med leiebil får du råd til for pengene du bruker på å eie bil i løpet av et år?</p>
                
                <p>Skriv inn beløp i kroner.</p>
                
                <form>
                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="aarlig_verditap">Verditap, renteutgifter, leasingleie med mer per år <small>(Husk forskuddsleie ved leasing)</small></label>
                        <input type="number" className="form-control inputBorder" min="0" id="aarlig_verditap" name="aarlig_verditap" onChange={this.handleChange} />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="forsikring">Forsikring (inkludert årsavgift)</label>
                        <input type="number" className="form-control inputBorder" min="0" id="forsikring" name="forsikring" onChange={this.handleChange} />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="bompenger">Bompenger</label>
                        <input type="number" className="form-control inputBorder" min="0" id="bompenger" name="bompenger" onChange={this.handleChange} />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="drivstoff">Drivstoff (bensin, diesel eller strøm)</label>
                        <input type="number" className="form-control inputBorder" min="0" id="drivstoff" name="drivstoff" onChange={this.handleChange} />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="vask">Dekkhotell, spylevæske og andre utgifter</label>
                        <input type="number" className="form-control inputBorder" min="0" id="vask" name="vask" onChange={this.handleChange} />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="service">Service</label>
                        <input type="number" className="form-control inputBorder" min="0" id="service" name="service" onChange={this.handleChange} />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <p>Dine årlige bilutgifter er <strong id="dine_kostnader"></strong> kroner.</p>
                    </div>

                    <div className="form-group row col-sm-12 col-xs-12">
                        <p>Til en timepris på 100 kroner, får du råd til å leie bil i <strong id="timer_kan_du_leie_bil"></strong> timer.</p>
                    </div>
                </form>
            </>
        );
    }
}