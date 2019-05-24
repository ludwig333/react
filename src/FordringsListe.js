import React, { Component } from 'react';
import './KravOppstilling.css';

import EikCard from './generics/EikCard';
import json_to_excel from './custom/json_to_excel';
import FordringUpdate from './FordringUpdate';

import moment from 'moment';
import { connect } from 'react-redux';
import {
    openCloseDialog
} from './modules/actions'


class FordringsListe extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFordring : props.data
        }
        this.updateFordring = this.updateFordring.bind(this);
    }

    updateFordring(e, id) {
        e.preventDefault();
        let fordring = this.props.fordringer.filter(o => o.Nr === id)[0];
        this.setState({selectedFordring : fordring}, e => {
            this.props.dispatch(openCloseDialog('UPDATE_FORDRING'));
        }
    );
    }

    render() {

        const tiltak = this.props.fordringer.map(o => {
            return (
                <tr>
                    <td>
                        <a key={o.Nr} href={`/Fordring?Sak=${o.Sak}&Fordring=${o.Nr}`}>  {o.Fakturanr} </a>
                    </td>
                    <td> {moment(o.Dato).format("L")} </td>
                    <td> {o.Forfall.includes("0000") ? "" : moment(o.Forfall).format("L")} </td>
                    <td> {moment(o.Foreldes).format("L")} </td>
                    <td> {o.Rest} </td>
                    <td> {o.Kravet_gjelder} </td>
                </tr>
            );
        });

        return (

				<EikCard
                    title="Fordringer"
                    subtitle={
                      <div onTouchTap={e => { e.stopPropagation();  json_to_excel(this.props.fordringer, "Fordringer")}}> Last ned </div>
                    }
                >
				<table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th> Nr </th>
                            <th> Dato </th>
                            <th> Forfall </th>
                            <th> Foreldes </th>
                            <th> Beløp </th>
                            <th> Kravet gjelder </th>
                        </tr>
                    </thead>
					<tbody>
                        {tiltak}
                    </tbody>
                </table>
                <FordringUpdate
                    show={this.props.updateFordringDialog}
                    data={this.state.selectedFordring}
                />
                </EikCard>
        )
    }
}

function mapStateToProps(state) {
    const { updateFordringDialog } = state.openCloseDialog;
    return {
        updateFordringDialog
    }
}


export default connect(mapStateToProps)(FordringsListe);
