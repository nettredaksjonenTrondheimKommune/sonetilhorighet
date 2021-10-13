import React from 'react';

export default class Barnehage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aarlig_verditap: 0,
            forsikring: 0,
            bompenger: 0,
            drivstoff: 0,
            vask: 0,
            service: 0,
            dine_kostnader: 0,
            timer_kan_du_leie_bil: 0,
            vis_timer_kan_du_leie_bil: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        document.getElementById('dine_kostnader').innerHTML = parseInt(this.state.dine_kostnader);
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
        var dine_utgifter = aarlig_verditap + forsikring + bompenger + drivstoff + vask + service;
        document.getElementById('dine_kostnader').innerHTML = parseInt(dine_utgifter);
        this.setState({
            dine_kostnader: dine_utgifter,
            [name]: value
        });
    }

    handleSubmit(event) {
        if(typeof document.getElementById('dine_kostnader').value === 'undefined') {
            document.getElementById('dine_kostnader').value = 0;
        }

        var timer_kan_du_leie_bil = parseInt(this.state.dine_kostnader / 100);

        this.setState({
            timer_kan_du_leie_bil: timer_kan_du_leie_bil,
            vis_timer_kan_du_leie_bil: true
        })
        event.preventDefault();
    }

    render() {
        const { vis_timer_kan_du_leie_bil, timer_kan_du_leie_bil } = this.state;

        return (
            <>
                <p>Hvor mange timer med leiebil får du råd til for pengene du bruker på å eie bil i løpet av et år?</p>
                
                <p>Skriv inn beløp i kroner.</p>
                
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="aarlig_verditap">Verditap, renteutgifter, leasingleie med mer per år <small>(Husk forskuddsleie ved leasing)</small></label>
                        <input type="number" className="form-control inputBorder" min="0" id="aarlig_verditap" name="aarlig_verditap" value={this.state.aarlig_verditap} onChange={this.handleChange} required />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="forsikring">Forsikring (inkludert årsavgift)</label>
                        <input type="number" className="form-control inputBorder" min="0" id="forsikring" name="forsikring" value={this.state.forsikring} onChange={this.handleChange} required />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="bompenger">Bompenger</label>
                        <input type="number" className="form-control inputBorder" min="0" id="bompenger" name="bompenger" value={this.state.bompenger} onChange={this.handleChange} required />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="drivstoff">Drivstoff (bensin, diesel eller strøm)</label>
                        <input type="number" className="form-control inputBorder" min="0" id="drivstoff" name="drivstoff" value={this.state.drivstoff} onChange={this.handleChange} required />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="vask">Dekkhotell, spylevæske og andre utgifter</label>
                        <input type="number" className="form-control inputBorder" min="0" id="vask" name="vask" value={this.state.vask} onChange={this.handleChange} required />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <label htmlFor="service">Service</label>
                        <input type="number" className="form-control inputBorder" min="0" id="service" name="service" value={this.state.service} onChange={this.handleChange} required />
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <p>Dine årlige bilutgifter er <strong id="dine_kostnader"></strong> kroner.</p>
                    </div>

                    <div className="form-group row col-sm-8 col-xs-8">
                        <input type="submit" className="btn btn-primary" value="Kalkuler" />
                    </div>
                </form>

                {vis_timer_kan_du_leie_bil &&
                    <div className="form-group row col-sm-12 col-xs-12">
                        <p>Til en timepris på 100 kroner, får du råd til å leie bil i <strong>{timer_kan_du_leie_bil}</strong> timer.</p>
                    </div>
                }
            </>
        );
    }
}