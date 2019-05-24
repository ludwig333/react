import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import FontAwesome from "react-fontawesome";
import EikCard from './generics/EikCard';
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import {
    fetchDebitornotater,
    deleteDebitornotat,
    snackbarMsg
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

class DebitorNotat extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            deleteDialogOpen: false,
            debitornotatSelectedForDeletion: 0
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchDebitornotater(sak()));
    }

    openDeleteDialog = (e, id) => {
        e.preventDefault();
        this.setState({
            deleteDialogOpen: true,
            debitornotatSelectedForDeletion: id
        });
    }

    closeDeleteDialog = (e, should_delete) => {
        e.preventDefault();
        if (should_delete) {
            this.deleteDebitornotat(this.state.debitornotatSelectedForDeletion);
        }
        this.setState({
            deleteDialogOpen: false,
            tiltak: 0
        });
    }

    deleteDebitornotat = (id) => {
        this.props.dispatch(snackbarMsg("Sletter debitornotat...", true));
        this.props
            .dispatch(deleteDebitornotat(id, sak()))
            .then(() => this.props.dispatch(snackbarMsg("Debitornotat slettet.", true)));
    }

    render() {


        const notater = this.props.notater.data;

        if (this.props.notater.loading) return null;
        if (this.props.debitor.loading) return null;

        if (notater.length === 0 && this.props.debitor.data.Gjennomgaende_notat.length === 0) return null;

        const genereltNotat = (
            this.props.debitor.data.Gjennomgaende_notat.length > 0 ?
                <tr>
                    <td></td>
                    <td></td>
                    <td>{this.props.debitor.data.Gjennomgaende_notat}</td>
                    <td>
                        <a>
                            <FontAwesome
                                name="trash"
                                size="2x"
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={e => this.openDeleteDialog(e, -1)}
                            />
                        </a>
                    </td>
                </tr> :
                null
        )

        const tabell = this.props.notater.data
            .slice()
            .reverse()
            .map(o => {
                return (
                    <tr>
                        <td> {moment(o.Dato).format("L")} </td>
                        <td> {o.Saksbehandler_navn} </td>
                        <td> {o.Notat} </td>
                        <td>
                            <a>
                                <FontAwesome
                                    name="trash"
                                    size="2x"
                                    style={{ color: "red", cursor: "pointer" }}
                                    onClick={e => this.openDeleteDialog(e, o.Nr)}
                                />
                            </a>
                        </td>
                    </tr>
                );
            });

        const actions = [
            <FlatButton
                label="Avbryt"
                primary={true}
                onTouchTap={e => this.closeDeleteDialog(e, false)}
            />,
            <FlatButton
                label="Slett"
                secondary={true}
                keyboardFocused={true}
                onTouchTap={e => this.closeDeleteDialog(e, true)}
            />
        ];

        return (
            <EikCard
                onExpandChange={this.onExpandChange}
                title="Debitornotater"
            >
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th> Dato </th>
                            <th> Saksbehandler </th>
                            <th> Notat </th>
                            <th> Slett </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tabell}
                        {genereltNotat}
                    </tbody>
                </table>
                <Dialog
                    title="Er du helt sikker?"
                    actions={actions}
                    modal={false}
                    open={this.state.deleteDialogOpen}
                />
            </EikCard>
        )
    }
}

function mapStateToProps(state) {
    const notater = state.debitorNotater;
    return {
        notater
    }
}

export default connect(mapStateToProps)(DebitorNotat);
