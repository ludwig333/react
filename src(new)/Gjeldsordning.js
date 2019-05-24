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

import InputValidation from './generics/InputValidation';

const initialState = {
    gjeldsordningsNr : "",
    datoOrdning : new Date(moment.now()),
    forste_termin : new Date(moment(moment.now())),
    siste_termin : new Date(moment(moment.now()).add(5, 'years').add(14, 'days')),
    avtaledok : false,
    ikkeSendGiro : false,
    termin : 2,
    belop : 500,
    empty : { gjeldsordningsNr : false }
}

const terminer = [
      ['uke', 'Ukentlig'],
      ['fjorten', 'Hver 14. dag'],
      ['mnd', 'Månedlig'],
      ['kvartal', 'Hvert kvartal'],
      ['halvar', "Hvert halvår"],
      ['ar', 'Hvert år']
]

class Gjeldsordning extends Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, initialState);
        this.dialogOpenClose = this.dialogOpenClose.bind(this);
        this.handleNumericInput = this.handleNumericInput.bind(this);
        this.clearState = this.clearState.bind(this);
        this.fv = new InputValidation(this);
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
        this.setState({belop : parseFloat(str)})
    }

    render() {

        let invalid = !this.fv.isValidated([this.state.empty])

        const actions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => this.props.dialogOpenClose('GJELDSORDNING')}
            />,
            <FlatButton
                label="Lagre"
                keyboardFocused={true}
                disabled={invalid}
                onTouchTap={e => {
                  this.props.createGjeldsordning(JSON.stringify(Object.assign({}, this.state, {termin : terminer[this.state.termin][0]}, {forfall : new Date(moment(this.state.forste_termin).subtract(14, 'days'))})));
                  this.clearState();
                }
              }
            />,
        ]

        return (
            <div className="sett-paa-vent">
                 <Dialog
                    open={this.props.dialogOpen}
                    title="Lag gjeldsordning"
                    actions={actions}
                    autoScrollBodyContent={true}
                 >
                 <Subheader> Terminlengde </Subheader>
                 <SelectField
                    floatingTextLabel="Terminlengde"
                    value={this.state.termin}
                    onChange={(event, idx, val) => this.setState({termin : idx})}
                  >
                    {
                        terminer.map(a => a[1]).map((val, idx) => {
                            return <MenuItem value={idx} primaryText={val} />
                        })
                    }
                  </SelectField>
                  <Subheader> Gjeldsordningsnummer </Subheader>
                  <TextField
                       autoFocus
                       value={this.state.gjeldsordningsNr}
                       errorText={this.fv.checkNotEmpty('gjeldsordningsNr')}
                       onChange={ (e, str) => this.fv.validateEmpty('gjeldsordningsNr', str) }
                   />
                  <Subheader> Avdragsstørrelse </Subheader>
                  <TextField
                       type="number"
                       value={this.state.belop === 0 ? "" : this.state.belop}
                       onChange={(e, str) => this.handleNumericInput(str)}
                   />
                   <Subheader> Første termin </Subheader>
                   <DatePickerNorwegian
                        onChange={(e, date) => this.setState({forste_termin : date})}
                        value={this.state.forste_termin}
                    />
                    <Subheader> Siste termin </Subheader>
                    <DatePickerNorwegian
                         onChange={(e, date) => this.setState({siste_termin : date})}
                         value={this.state.siste_termin}
                     />
                    <br/>
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

export default Gjeldsordning;
