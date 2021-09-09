import React, { Component } from 'react';
import './customStyle.css';
import fetchPlaner from '../../service/tommekalender';

export default class Tommekalender extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tommeplan: [],
            antallUker: 5,
            filter: null
        };
    }

    componentDidMount() {
        this._ismounted = true;
        this.updatePlan(this.props.adresse);
    }

    componentWillUnmount() {
        // TODO: Consider to separate fetching and viewing logic.
        // Pros current solution: Simple usage of component.
        // Cons current solution: Minor memory leak, need to keep component state until promise finishes.
        this._ismounted = false;
    }

    componentDidUpdate(nextProps) {
        const { adresse } = this.props;
        if (nextProps.adresse !== adresse) {
            this.updatePlan(nextProps.adresse);
        }
    }

    updatePlan = (adresse) => fetchPlaner(adresse, this.props.dispatch).then((tommeplan) => this._ismounted && this.setState({ tommeplan }));

    render() {
        const { tommeplan, antallUker, filter } = this.state;
        let harMer = null;
        let beskrivelseNavn = null;
        let synlig = null;
        let antallTomminger = null;

        if (tommeplan.length !== 0) {
            antallTomminger = tommeplan[0].calendar.filter((week) => (filter === null ? true : week.wastetype.includes(filter)));
            synlig = tommeplan[0].calendar
                .filter((week) => (filter === null ? true : week.wastetype.includes(filter)))
                .slice(0, antallUker);
            harMer = antallTomminger.length > antallUker;
            beskrivelseNavn = tommeplan[0].descriptions.map((description) => description.name);
        }

        return (tommeplan.length === 0
            ? <div className="box bg-blue margin-top text-center"><h4>Vi finner ingen tømmekalender som hører til denne adressen!</h4></div>
            :
            <div className="box boks-tommekalender margin-top text-center">
                <h3>Tømmekalender</h3>
                <div className="hidden-xs hidden-sm hidden-md">
                    <button type="button" className={filter === null ? 'btn btn-primary btn-sm' : 'btn btn-default btn-sm'} onClick={() => this.setState({ filter: null })}>Vis alle</button>
                    {beskrivelseNavn.map((description) => (
                        <button type="button" className={filter === description ? 'btn btn-primary btn-sm' : 'btn btn-default btn-sm'} key={description} onClick={() => this.setState({ filter: description })}>{description}</button>
                    ))}
                </div>

                <div className="hidden-lg">
                    <select className="form-control hidden-lg" onChange={(beskrivelse) => this.setState({ filter: beskrivelse.target.value })}>
                        <option value={null}>Vis alle</option>
                        {beskrivelseNavn.map((description) => (
                            <option value={description} key={description}>{description}</option>
                        ))}
                    </select>
                </div>

                <table className="table table-striped margin-top hidden-xs hidden-sm">
                    <thead>
                        <tr>
                            <th>Uke</th>
                            <th>Type avfall</th>
                            <th>Dato</th>
                        </tr>
                    </thead>
                    <tbody>
                        {synlig.map((plan, i) => (
                            <tr className="text-left" key={`${plan.id}-${plan.week}`}>
                                <td>{plan.week}</td>
                                <td>{plan.wastetype}</td>
                                <td>{plan.date_week_start}-{plan.date_week_end}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ul className="list-group list-group-striped margin-top hidden-lg hidden-md">
                    {synlig.map((plan) => (
                        <li className="list-group-item" key={`${plan.id}-${plan.week}`}>
                            <h4>Uke: {plan.week} {plan.wastetype}</h4>
                            <p>{plan.date_week_start}-{plan.date_week_end}</p>
                        </li>
                    ))}
                </ul>
                {harMer && (
                    <button type="button" className="btn btn-primary" onClick={() => this.setState({ antallUker: antallUker + 5 })}>Vis flere uker</button>
                )}
            </div>
        )
    }
}