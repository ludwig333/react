import React from 'react';
import { connect } from 'react-redux';

import EikCard from './generics/EikCard';

import moment from 'moment';

import {
    fetchDebitorSaker
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

class DebitorSakerKort extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchDebitorSaker(sak()));
    }

    render() {

        const {saker} = this.props;

        
      

        const status = (obj) => {
          switch (true) {
            case obj.Pa_vent:
              return <td style={{color : "orange"}}> På vent </td>
            case obj.Langtidsovervaking:
              return <td style={{color : "orange"}}> Langtidsovervåkning </td>
            case obj.Gjeldsordning:
              return <td style={{color : "blue"}}> Gjeldsordning </td>
            case obj.Avdragsavtale:
              return <td style={{color : "blue"}}> Avdragsavtale </td>
            default:
              return <td style={{color : "green"}}> Aktiv </td>
          }
        }

        const tabellAktive = saker.data
        .slice()
        .filter(o => o.Avsluttet.includes('0000'))
        .reverse()
        .map(o => {
            return (
                <tr>
                    <td>
                        <a href={`/Sak?sak=${o.Nr}`}> {o.Nr} </a>
                    </td>
                    <td> {o.Saldo} </td>
                    {status(o)}
                    <td></td>
                </tr>
            )
        });

        const tabellAvsluttede = saker.data
        .slice()
        .filter(o => !o.Avsluttet.includes('0000'))
        .reverse()
        .map(o => {
            return (
                <tr>
                    <td>
                        <a href={`/Sak?sak=${o.Nr}`}> {o.Nr} </a>
                    </td>
                    <td> {o.Saldo} </td>
                    {o.Avsluttet.includes('0000') ?
                        [<td style={{color : "green"}}> Aktiv </td>, <td> </td>] :
                        [<td style={{color : "red"}}> Avsluttet </td>,
                        <td> {moment(o.Avsluttet).format('L')} </td>] }

                </tr>
            )
        });

        const summary = (
                <tr style={{borderTop : "1px", borderTopStyle: "solid"}} >
                    <td> Saldo aktive saker </td>
                    <td> {saker.data.filter(a => a.Avsluttet.includes('0000')).map(a => a.Saldo).reduce((p,c) => p + c , 0).toFixed(2)} </td>
                    <td> </td>
                    <td> </td>
                </tr>
        )

        return (
            <EikCard
                title="Saker tilhørende debitor"
            >
                <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                          <td> Sak </td>
                          <td> Saldo </td>
                          <td> Status </td>
                          <td> Avsluttet </td>
                      </tr>
                    </thead>
                    <tbody>
                        {tabellAktive}
                        {tabellAvsluttede}
                        {summary}
                    </tbody>
                </table>
            </EikCard>
        )

    }

}

function mapStateToProps(state) {
    const saker = state.debitorSakerList;
    const dialogOpen = state.openCloseDialog.DEBITOR_SAKER;
    return {
        saker,
        dialogOpen,
    }
}

export default connect(mapStateToProps)(DebitorSakerKort);
