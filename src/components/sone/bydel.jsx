import React, { Component } from 'react';
import './customStyle.css';
import finnSoner from '../../service/tk-geoapi';

export default class Bydel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adresse: '',
            bydel: {}
        };
    }

    async componentDidMount() {
        this.setState({
            bydel: await finnSoner(this.props.adresse, 'finnbydel')
        });
    }

    render() {
        const { bydel } = this.state;

        return (bydel.length === 0
            ? <div></div>
            :
            <>
                <div className="boks bla-boks">
                    <h4 className="senter">
                        {bydel.bydelnavn}
                    </h4>
                </div>
            </>
        )
    }
}