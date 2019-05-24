import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import moment from 'moment';

import {
    fetchDebitorSaker,
    openCloseDialog
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;}

class DebitorSaker extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchDebitorSaker(sak()));
    }

    openClose = () => {
        this.props.dispatch(openCloseDialog('DEBITOR_SAKER'))
    }

    render() {

        const {saker, dialogOpen} = this.props;

        if (saker.loading) return null;

        const actions = [
            <FlatButton
                onTouchTap={this.openClose}
                label="Lukk"
            />
        ]

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
                    <td> {o.Saksgang} </td>
                    <td>  </td>
                    <td> {o.Siste_tiltak} </td>
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
                        <td style={{color : "green"}}> Aktiv </td>  :
                        <td style={{color : "red"}}> Avsluttet </td> }
                    <td> {o.Saksgang} </td>
                    <td> {moment(o.Avsluttet).format('L')} </td>
                    <td> {o.Siste_tiltak} </td>
                </tr>
            )
        });

        const summary = (
                <tr style={{borderTop : "2px", borderTopStyle: "solid"}} >
                    <td> Saldo alle saker </td>
                    <td> {saker.data.map(a => a.Saldo).reduce((p,c) => p + c , 0).toFixed(2)} </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                </tr>
        )

        return (
            <Dialog
                autoScrollBodyContent={true}
                open={dialogOpen}
                actions={actions}
                title="Debitors saker"
            >
            <table className="table table-striped table-sm">
                <thead>
                <tr>
                    <td> Sak </td>
                    <td> Saldo </td>
                    <td> Status </td>
                    <td> Saksgang </td>
                    <td> Avsluttet </td>
                    <td> Siste tiltak </td>
                </tr>
                </thead>
                <tbody>
                    {tabellAktive}
                    <br/>
                    {tabellAvsluttede}
                    {summary}
                </tbody>
            </table>
            </Dialog>
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

export default connect(mapStateToProps)(DebitorSaker);
