import React from 'react';
import { connect } from 'react-redux';

import EikCard from './generics/EikCard';

import moment from 'moment';

import {
    fetchSakList
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

class SamlesakList extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchSakList(sak()));
    }

    render() {

        const {samlesakList} = this.props;

        

        const tabellAktive = samlesakList.data
        .map(o => {
            return (
                <tr>
                    <td>
                        <a href={`/Sak?sak=${o.Sak}`}> {o.Sak} </a>
                    </td>
                    <td> {o.Registrert} </td>
                    <td> {o.Saldo} </td>
                </tr>
            )
        });

        return (
            <EikCard
                title="Samlede saker"
            >
                <table className="table table-striped table-sm">
                    <thead>
                      <tr>
                          <td> Sak </td>
                          <td> Registrert </td>
                          <td> Saldo </td>
                      </tr>
                    </thead>
                    <tbody>
                        {tabellAktive}
                    </tbody>
                </table>
            </EikCard>
        )

    }

}

function mapStateToProps(state) {
    const samlesakList = state.samlesakList;
    const dialogOpen = state.openCloseDialog.DEBITOR_SAKER;
    return {
        samlesakList,
        dialogOpen,
    }
}

export default connect(mapStateToProps)(SamlesakList);
