import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {
    fetchNotater,
    snackbarMsg
} from './modules/actions';

import moment from 'moment';

import { connect } from 'react-redux';

import DatePickerNorwegian from './generics/DatePickerNorwegian';

function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

const initialState = {
    text : "",
    forfall : new Date(moment(moment.now()).add('days', 14)),
    epost : false,
    file : null,
    sak : getURLParameter()
}

class NyttNotat extends Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({}, initialState);
        this.saveNotat = this.saveNotat.bind(this);
    }

    saveNotat() {

        let data = new FormData();
        data.append("Notat", this.state.text);
        data.append("Epost", this.state.epost);
        data.append("Forfall", this.state.forfall.toISOString());
        data.append("Dato", new Date(moment(moment.now()).toISOString()))
        if (this.state.file) {
            data.append("pdf", this.state.file);
        }

        this.props.dispatch(snackbarMsg("Oppretter notat...", true))
        this.props.dialogOpenClose("NYTT_NOTAT");
        fetch(`/4daction/notat_create?sak=${this.state.sak}`, {
            credentials : 'include',
            method : 'POST',
            body : data
        }).then(res => {
            this.props.dispatch(fetchNotater(this.state.sak));
            this.props.dispatch(snackbarMsg("Opprettet notat", true))
            this.setState(initialState);

        })
    }

    render() {


        const actions = [
        <FlatButton
            containerElement='label'
            label="Last opp PDF"
            >
            <input name="pdf" onChange={e => this.setState({file : e.target.files[0]})} style={{display : "none"}} type="file" />
        </FlatButton>
        ,
        <FlatButton
            label="Avbryt"
            onTouchTap={(e) => this.props.dialogOpenClose("NYTT_NOTAT")}
        />,
        <FlatButton
            onTouchTap={this.saveNotat}
            label="Lagre"
        />,
        ]


        return (
            <div>
                    <Dialog
                        open={this.props.dialogOpen}
                        title="Nytt notat"
                        actions={actions}
                        autoScrollBodyContent={true}
                    >
                        <TextField
                            autoFocus
                            name="Notat"
                            type="text"
                            floatingLabelText="Notat"
                            value={this.state.text}
                            onChange={(e, str) => this.setState({text : str})}
                            multiLine={true}
                        />
                        <br/>
                        <DatePickerNorwegian
                            type="text"
                            name="Forfall"
                            hintText="Forfallsdato"
                            minDate={new Date(moment(moment.now()).add('days', 1))}
                            value={this.state.forfall}
                            onChange={(e, date) => this.setState({forfall : date})}

                        />
                        <br/>
                        <Checkbox
                            type="checkbox"
                            name="Epost"
                            label="Send påminnelse på epost"
                            labelPosition="left"
                            value={this.state.epost}
                            onCheck={(e, bool) => this.setState({epost : bool})}
                        />
                    </Dialog>
            </div>
        )

    }
}

function mapStateToProps(state) {
    const {notat, date, forfall, file} = state.notatInput;
    const { Nr } = state.generellInfo;
    return {
        notat,
        date,
        forfall,
        file,
        Nr
    }
}

export default connect(mapStateToProps)(NyttNotat);
