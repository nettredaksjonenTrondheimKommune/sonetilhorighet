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

    componentWillReceiveProps(nextProps) {
        const { adresse } = this.props;
        if (nextProps.adresse !== adresse) {
            this.updatePlan(nextProps.adresse);
        }
    }

    updatePlan = (adresse) => fetchPlaner(adresse, this.props.dispatch).then((tommeplan) => this._ismounted && this.setState({ tommeplan }));

    render() {
        const { tommeplan, antallUker, filter } = this.state;
        let hasMore = null;
        let descriptionNames = null;
        let shown = null;

        if (tommeplan.length !== 0) {
            shown = tommeplan[0].calendar
                .filter((week) => (filter === null ? true : week.wastetype.includes(filter)))
                .slice(0, antallUker);
            hasMore = tommeplan[0].calendar.length > antallUker;
            descriptionNames = tommeplan[0].descriptions.map((description) => description.name);

            // for (var i = 0; i < tommeplan[0].calendar.length; i++) {
            //     var start = tommeplan[0].calendar[i].date_week_start.split('-');
            //     tommeplan[0].calendar[i].date_week_start = start[2] + "." + start[1] + "." + start[0];
            //     var slutt = tommeplan[0].calendar[i].date_week_end.split('-');
            //     tommeplan[0].calendar[i].date_week_end = slutt[2] + "." + slutt[1] + "." + slutt[0];
            // }
        }

        return (tommeplan.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks margin-top senter">
                    <h3>Tømmekalender</h3>
                    <button className={filter === null ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => this.setState({ filter: null })}>Vis alle</button>
                    {descriptionNames.map((description) => (
                        <button className={filter === description ? 'btn btn-primary' : 'btn btn-secondary'} key={description} onClick={() => this.setState({ filter: description })}>{description}</button>
                    ))}
                    <table className="table table-striped venstrestilt">
                        <thead>
                            <tr>
                                <th>Uke</th>
                                <th>Type avfall</th>
                                <th>Dato</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shown.map((plan, i) => (
                                <tr key={`${plan.id}-${plan.week}`}>
                                    <td>{plan.week}</td>
                                    <td>{plan.wastetype}</td>
                                    <td>{plan.date_week_start}-{plan.date_week_end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {hasMore && (
                        <button type="button" className="btn btn-primary" onClick={() => this.setState({ antallUker: antallUker + 5 })}>Vis mer</button>
                    )}
                </div>
            </>
        )
    }
}