import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';

import DatePickerNorwegian from './generics/DatePickerNorwegian';
import moment from 'moment';

const initialState = {
    termin : 3,
    belop : 500,
    forfall : new Date(moment(moment.now()).add(14, 'days')),
    gjeldsbevis : false,
    avtaledok : false,
    ikkeSendGiro : false
}

const terminer = [
    'Hver uke',
    'Hver 14. dag',
    'Hver måned',
    'Hvert kvartal',
    'Hvert halvår',
    'Hvert år'
]


class Avdragsavtale extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initialState);
        this.dialogOpenClose = this.dialogOpenClose.bind(this);
        this.handleNumericInput = this.handleNumericInput.bind(this);
        this.clearState = this.clearState.bind(this);
    }

    clearState() {
        this.setState(Object.assign({}, initialState));
    }

    dialogOpenClose () {
        this.setState({
            dialogOpen : !this.state.dialogOpen
        })
    }

    handleNumericInput(str) {
        if (str === "") str = "0";
        this.setState({belop : parseInt(str, 10)})
    }

    render() {

        const actions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => this.props.dialogOpenClose('AVDRAGSAVTALE')}
            />,
            <FlatButton
                label="Lagre"
                keyboardFocused={true}
                onTouchTap={e => {
                  const state = JSON.stringify(Object.assign({}, this.state));
                  this.props.createAvdragsavtale(state);
                  this.clearState();
                }}
            />,
        ]

        return (
            <div>
                 <Dialog
                    autoScrollBodyContent={true}
                    open={this.props.dialogOpen}
                    title="Opprett avdragsavtale"
                    actions={actions}

                 >
                 <Subheader> Terminlengde </Subheader>
                 <SelectField
                    floatingTextLabel="Terminlengde"
                    value={this.state.termin-1}
                    onChange={(event, idx, val) => this.setState({termin : val+1})}
                  >
                    {
                        terminer.map((val, idx) => {
                            return <MenuItem value={idx} primaryText={val} />
                        })
                    }
                  </SelectField>
                  <Subheader> Avdragsstørrelse </Subheader>
                  <TextField
                       type="number"
                       value={this.state.belop === 0 ? "" : this.state.belop}
                       onChange={(e, str) => this.handleNumericInput(str)}
                   />
                   <DatePickerNorwegian
                        floatingLabelText="Første forfall"
                        onChange={(e, date) => this.setState({forfall : date})}
                        value={this.state.forfall}
                    />
                    <Checkbox
                        label="Skriv ut gjeldsbevis"
                        onCheck={(e, bool) => this.setState({gjeldsbevis : bool})}
                        value={this.state.gjeldsbevis}
                    />
                    <Checkbox
                        label="Skriv ut avtaledokument"
                        onCheck={(e, bool) => this.setState({avtaledok : bool})}
                        value={this.state.avtaledok}
                    />
                    <Checkbox
                        label="Ikke send giro på avdrag"
                        onCheck={(e, bool) => this.setState({ikkeSendGiro : bool})}
                        value={this.state.ikkeSendGiro}
                    />
                 </Dialog>
            </div>
        )
    }
}

export default Avdragsavtale;
