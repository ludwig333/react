import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import DatePickerNorwegian from './generics/DatePickerNorwegian';
import moment from 'moment';

 

const initialState = {
    notat : "",
    forfall : new Date(moment(moment.now()).add(14, 'days')),
    paaminnelse : false,
    opphev : false
}

class SettPaaVent extends Component {

    constructor(props) {
        super(props);
console.log("MaxVent",props.MaxVent);
        this.state = Object.assign({}, initialState);

        this.submitSettPaaVent = this.submitSettPaaVent.bind(this);
        this.submitOpphevPaaVent = this.submitOpphevPaaVent.bind(this);

    }

    submitSettPaaVent() {
        let obj = Object.assign({}, this.state);
        obj.forfall = moment(obj.forfall).format('L').toString();
        this.props.settPaaVent(JSON.stringify(obj));
        this.setState(initialState);
    }

    submitOpphevPaaVent() {
        const opphev = {opphev : true}
        this.props.settPaaVent(JSON.stringify(opphev));
        this.setState(initialState);
    }

    render() {
       const endOfWeek = moment().add(this.props.MaxVent, 'days');
        const opphevActions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => this.props.dialogOpenClose('PAA_VENT')}
            />,
            <FlatButton
                label="Opphev"
                keyboardFocused={true}
                onTouchTap={e => this.submitOpphevPaaVent()}
            />,
        ]

        if (this.props.is_paa_vent) {
            return (
                <div>
                 <Dialog
                    open={this.props.dialogOpen}
                    title="Opphev på vent"
                    actions={opphevActions}
                 >
                 </Dialog>
            </div>
            )
        }


        const actions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => this.props.dialogOpenClose('PAA_VENT')}
            />,
            <FlatButton
                label="Lagre"
                onTouchTap={e => this.submitSettPaaVent()}
            />,
        ]

        return (
            <div>
                 <Dialog
                    open={this.props.dialogOpen}
                    title="Sett sak på vent"
                    actions={actions}
                 >
                    <DatePickerNorwegian
                        floatingLabelText="Utsett til dato"
                        onChange={(e, date) => this.setState({forfall : date})}
                        maxDate = {new Date(endOfWeek)}
                        value={this.state.forfall}
                     />
                    <TextField
                        autoFocus
                        floatingLabelText="Notat"
                        multiLine={true}
                        onChange={(e, str) => this.setState({notat : str})}
                        value={this.state.notat}
                    />
                    <Checkbox
                            label="Send påminnelse på epost"
                            labelPosition="right"
                            onCheck={(e, bool) => this.setState({paaminnelse : bool})}
                            value={this.state.paaminnelse}
                    />

                 </Dialog>
            </div>
        )
    }
}

export default SettPaaVent;
