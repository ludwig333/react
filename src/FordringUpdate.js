import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DatePickerNorwegian from './generics/DatePickerNorwegian.js';

import moment from 'moment';


const sikkerhet = [
    'ingen',
    'salgspant',
    'legalpant',
    'avtalepant',
    'utleggspant',
    'motregning',
    'simpelKausjon',
    'selvskyldnerKausjon',
    'gjeldsbevis',
    'bankgaranti',
    'forliksrad'
]

const dateFields = [
    'Dato',
    'Forfall',
    'Foreldes'
]

const numFields = [
    'Gardsnr',
    'Bruksnr',
    'Festenr',
    'Seksjonsnr',
    'Rest'
]

const textfields = [
    'Fakturanr',
    'Betegnelse',
    'Eksternt_nr',
    'Kravet_gjelder'
]
/** 
const initialState = {
    fakturanr : "",
    dato : new Date(moment.now()),
    datoForfall : new Date(moment(moment.now()).add(14, 'days')),
    datoForeldelse : new Date(moment(moment.now()).add(3, 'years')),
    rest : "",
    eksternId : "",
    gnr : "",
    bnr : "",
    fnr : "",
    snr : "",
    gjelder : "",
    sikkerhet: "",
    update : false
}
*/

export default class FordringUpdate extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = Object.assign({}, props.data)
        this.updateVal = this.updateVal.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState(this.props.data);
    }

    updateVal(val, str) {
        this.setState({[str] : val});
    }

    render() {

        const dateInput = dateFields.map(str => {
            return <DatePickerNorwegian
                onChange={(e, date) => this.updateVal(new Date(date).toISOstring(), str)}
                floatingLabelText={str}
                value={new Date(moment(this.state[str]))} 
                />
        })

        const textInput = textfields.map(str => {
            return <TextField
                onChange={e => this.updateVal(e.target.value, str)}
                floatingLabelText={str}
                value={this.state[str]} 
                />
        })

        const numericInput = numFields.map(str => {
            return <TextField
                onChange={e => this.updateVal(e.target.value, str)}
                floatingLabelText={str}
                value={this.state[str]}
                />
        })

        const actions = [
            <RaisedButton label="Avbryt" />,
            <RaisedButton label="Lagre" />
        ]

        return(
                <Dialog
                    open={this.props.show}
                    title="Rediger fordring"
                    actions={actions}
                >
                {dateInput}
                {textInput}
                {numericInput}
                <SelectField
                    floatingLabelText="Sikkerhet"
                    onChange={(e,i,v) => this.setState({Sikkerhet : v})}
                    value={this.state.Sikkerhet}
                >
                    {sikkerhet.map((a, i)=> {
                        return <MenuItem value={i} primaryText={a} />
                    })}
                </SelectField>
                </Dialog>
        )
    }
}