import React from 'react';
import { getCoordinate } from '../../service/kartverket';
import barnehagerRaw from '../../service/barnehager.json';

const defaultState = {
    coordinate: null,
    barnehager: [],
    synligeBarnehager: 5,
};
export default class Barnehage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...defaultState };

    }
    componentDidMount() {
        this._ismounted = true;
        this.updateNearestBarnehage(this.props.adresse);
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
            this.setState({ ...defaultState });
            this.updateNearestBarnehage(nextProps.adresse);
        }
    }

    updateNearestBarnehage = (adresse) =>
        getCoordinate(adresse, this.props.dispatch)
            .then((coordinate) => this._ismounted && this.setState({ coordinate }))
            .then(() => this._ismounted && this.updateBarnehageDistance());

    updateBarnehageDistance = () => {
        const { coordinate } = this.state;

        const barnehager = [
            ...barnehagerRaw.map((barnehage) => {
                const distance = calcDistance(barnehage.coordinate, coordinate);

                return { ...barnehage, distance };
            }),
        ];

        barnehager.sort((a, b) => a.distance - b.distance);
        this.setState({ barnehager });
    };

    render() {
        const { synligeBarnehager: shownBarnehager, barnehager } = this.state;
        const visibleBarnehager = barnehager.slice(0, shownBarnehager);
        const visMerKnapp = shownBarnehager < barnehager.length;

        return (
            <div className="boks bla-boks margin-top text-center">
                <h3>Nærmeste barnehager</h3>
                {visibleBarnehager.map((barnehage, index) => (
                    <p key={index}><a href={barnehage.url}>{barnehage.name}</a>, avstand i luftlinje: {prettyDistance(barnehage.distance)}</p>
                ))}
                {visMerKnapp && (
                    <button type="button" className="btn btn-primary" onClick={() => this.setState({ synligeBarnehager: shownBarnehager + 5 })}>Vis mer</button>
                )}
            </div>
        );
    }
}

function calcDistance(a, b) {
    if (!a || !b) {
        return Infinity;
    }

    // √( (x_a - x_b)² + (y_a - y_b)² )
    return Math.floor(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));
}

function prettyDistance(d) {
    return d < 1000 ? `${d} meter` : `${Math.floor(d / 100) / 10} km`;
}