import React, { Component } from 'react';
import moment from 'moment';
import json_to_excel from './custom/json_to_excel';

import EikCard from './generics/EikCard';

class Innbetalinger extends Component {

    render() {

        let innbetalinger = this.props.innbetalinger.data
        .filter(o => o.Betalt !== 0);

        innbetalinger = JSON.parse(JSON.stringify(innbetalinger))
        .sort((a, b) => new Date(b.Betalingsdato).getTime() - new Date(a.Betalingsdato).getTime());

        console.log(innbetalinger)
        innbetalinger = innbetalinger
        .map(o => {
            return (
                <tr>

                    <td> <a href={`/Avdrag?Sak=${o.Sak}&Avdrag=${o.Nr}`}> {moment(o.Betalingsdato).format("L")} </a> </td>
                    <td> {o.saksbehandler_navn} </td>
                    <td> {moment(o.Registrert).format("L")} </td>
                    <td> {o.Betalt} </td>
                    <td> {o.Hovedstol} </td>
                    <td> {o.Saler_og_omkostninger} </td>
                    <td> {o.Renter} </td>
                    <td> {o.Bokført.includes("0000") ? "Nei" : moment(o.Bokført).format("L")} </td>
                    <td> {o.Tekst} </td>
                </tr>
            );
        });

        if (innbetalinger.length === 0) return null;

        

        return (
            <EikCard
                title="Innbetalinger"
                subtitle={
                  <div onTouchTap={e => { e.stopPropagation();  json_to_excel(this.props.innbetalinger.data, "Innbetalinger")}}> Last ned </div>
                }
            >
				<table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th> Dato </th>
                            <th> Saksbehandler </th>
                            <th> Registrert </th>
                            <th> Betalt </th>
                            <th> Hovedstol </th>
                            <th> Sal/Omk </th>
                            <th> Renter </th>
                            <th> Bokført </th>
                            <th> Tekst </th>
                        </tr>
                    </thead>
					<tbody>
                        {innbetalinger}
                    </tbody>
                </table>
            </EikCard>
        )
    }
}

export default Innbetalinger;
