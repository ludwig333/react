import React from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DatePickerNorwegian from './generics/DatePickerNorwegian';

import moment from 'moment';

const isNotEmpty = {
  Rest : false,
  Kravet_gjelder : false
}

const isValid = {
  Rest : false
}

const initialState = {
    Fakturanr : "",
    Betegnelse : "Faktura",
    Gardsnr : "",
    Bruksnr : "",
    Festenr : "",
    Seksjonsnr : "",
    Sikkerhet : 0,
    Dato : new Date(moment.now()),
    Forfall : new Date(moment(moment.now()).add('days', 14)),
    Foreldes : new Date(moment(moment.now()).add('years', 3).add('days', 14)),
    Rest : "",
    valid : isValid,
    empty : isNotEmpty
}

const typeSikkerhet = [
    'Ingen',
    'Salgspant',
    'Legalpant',
    'Avtalepant',
    'Utleggspant',
    'Motregningserklæring',
    'Simpel kausjon',
    'Selvskyldnerkausjon',
    'Gjeldsbevis',
    'Bankgaranti',
    'Forliksrådsdom'
]

class FordringCreate extends React.Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({}, initialState);
        console.log(props);
    }

    handleChangeSikkerhet = (e, i, v) => {
        this.setState({Sikkerhet : i});
    }

    handleSubmit = (json) => {
        json.Rest.replace(".", ",");
        const a = JSON.stringify(json);
        this.props.createFordring(a);
    }

    checkValid = (field_name) => this.state.valid[field_name] ? "" : "Ugyldig verdi"
    checkNotEmpty = (field_name) => this.state.empty[field_name] ? "" : "Må fylles ut"

    validation = (field_name) => {
      if (this.state.empty[field_name]) {
        return this.checkValid(field_name);
      }
      return this.checkNotEmpty(field_name);
    }

    validateObj = (obj) => Object.keys(obj).reduce((acc, x) => obj[x] && acc, true)
    isValidated = (states) => states.reduce((acc, x) => acc && this.validateObj(x), true);

    validateEmpty = (field_name, str) => {
      let empty = {...this.state.empty};
      empty[field_name] = str !== "" && str !== "0"
      this.setState({empty});
    }

    validateType = (field_name, str) => {
      let valid = {...this.state.valid};
      valid[field_name] = !isNaN(str.replace(",","."))
      this.setState({valid});
    }

    setAndValidate = (funcs) => (field_name, str) => {
      let o = {}
      o[field_name] = str
      this.setState({...o});
      funcs.forEach(f => {f(field_name, str)});
    }

    validateEmpty = this.setAndValidate([this.validateEmpty]);
    validateTypeAndEmpty = this.setAndValidate([this.validateEmpty, this.validateType])


    render() {

        let invalid = !this.isValidated([this.state.empty, this.state.valid]);

        const actions = [
            <FlatButton onTouchTap={e => this.props.dialogOpenClose('NY_FORDRING')} label="Avbryt" /> ,
            <FlatButton disabled={invalid} onTouchTap={e => this.handleSubmit(this.state)} label="Opprett" />
        ]

        return(
            <Dialog
                open={this.props.dialogOpen}
                title="Opprett fordring"
                actions={actions}
            >
            <div className="row">
            <div className="col-md-6">
                <TextField
                    hintText="Fakturanummer"
                    onChange={(e, str) => this.setState({Fakturanr : str})}
                    value={this.state.Fakturanr}
                />
                <TextField
                    hintText="Betegnelse"
                    onChange={(e, str) => this.setState({Betegnelse : str})}
                    value={this.state.Betegnelse}
                />
                <TextField
                    hintText="Gårdsnummer"
                    onChange={(e, str) => this.setState({Gardsnr : str})}
                    value={this.state.Gardsnr}
                />
                <TextField
                    hintText="Bruksnr"
                    onChange={(e, str) => this.setState({Bruksnr : str})}
                    value={this.state.Bruksnr}
                />
                <TextField
                    hintText="Festenr"
                    onChange={(e, str) => this.setState({Festenr : str})}
                    value={this.state.Festenr}
                />
                <TextField
                    hintText="Seksjonsnr"
                    onChange={(e, str) => this.setState({Seksjonsnr : str})}
                    value={this.state.Seksjonsnr}
                />
                <TextField
                    autoFocus
                    hintText="Kravet gjelder"
                    multiLine={true}
                    errorText={this.checkNotEmpty('Kravet_gjelder')}
                    onChange={(e, str) => this.validateEmpty('Kravet_gjelder', str)}
                    value={this.state.Kravet_gjelder}
                />
            </div>
            <div className="col-md-6">
                <SelectField
                    floatingLabelText="Sikkerhet"
                    value={this.state.Sikkerhet}
                    onChange={this.handleChangeSikkerhet}
                >
                {typeSikkerhet.map((a,i) => {
                    return (
                        <MenuItem value={i} primaryText={typeSikkerhet[i]} />
                    )
                })}
                </SelectField>
                <DatePickerNorwegian
                    floatingLabelText="Dato"
                    value={this.state.Dato}
                    onChange={(e, date) => this.setState({Dato : date})}
                />
                <DatePickerNorwegian
                    floatingLabelText="Forfall"
                    value={this.state.Forfall}
                    onChange={(e, date) => this.setState({Forfall : date})}
                />
                <DatePickerNorwegian
                    floatingLabelText="Foreldelse"
                    value={this.state.Foreldes}
                    onChange={(e, date) => this.setState({Foreldes : date})}
                />
                <TextField
                    style={{marginTop : "20px"}}
                    floatingLabelText="Rest"
                    errorText={this.validation('Rest')}
                    onChange={(e, str) => this.validateTypeAndEmpty('Rest',str)}
                    value={this.state.Rest}
                />
            </div>
            </div>
            </Dialog>
        );
    }
}

export default FordringCreate;
