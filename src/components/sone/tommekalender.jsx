import React, { Component } from 'react';
import './customStyle.css';
import fetchPlaner from '../../service/tommekalender';

export default class Tommekalender extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tommeplan: [],
            antallUker: 4,
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

        if (tommeplan.length !== 0) {
            synlig = tommeplan[0].calendar
                .filter((week) => (filter === null ? true : week.wastetype.includes(filter)))
                .slice(0, antallUker);
            harMer = tommeplan[0].calendar.length > antallUker;
            beskrivelseNavn = tommeplan[0].descriptions.map((description) => description.name);
        }

        return (tommeplan.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top text-center">
                    <h3>Tømmekalender</h3>
                    <button type="button" className={filter === null ? 'btn btn-primary' : 'btn btn-default'} onClick={() => this.setState({ filter: null })}>Vis alle</button>
                    {beskrivelseNavn.map((description) => (
                        <button type="button" className={filter === description ? 'btn btn-primary' : 'btn btn-default'} key={description} onClick={() => this.setState({ filter: description })}>{description}</button>
                    ))}
                    <table className="table table-striped margin-top">
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
                    {harMer && (
                        <button type="button" className="btn btn-primary" onClick={() => this.setState({ antallUker: antallUker + 5 })}>Vis mer</button>
                    )}
                </div>
            </>
        )
    }
}