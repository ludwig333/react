import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import DatePickerNorwegian from './generics/DatePickerNorwegian';
import moment from 'moment';

const initialState = {
    avsluttet : new Date(moment.now()),
    gjennoppta : false
}

class AvsluttSak extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    render() {

        const actions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => this.props.dialogOpenClose('AVSLUTT_SAK')}
            />,
            <FlatButton
                label="Lagre"
                keyboardFocused={true}
                onTouchTap={e => this.props.avsluttSak(JSON.stringify(this.state))}
            />,
        ]

        const gjennopptaActions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => this.props.dialogOpenClose('AVSLUTT_SAK')}
            />,
            <FlatButton
                label="Gjennoppta"
                keyboardFocused={true}
                onTouchTap={e => this.props.avsluttSak(JSON.stringify({gjennoppta : true}))}
            />,
        ]

        if (this.props.is_avsluttet) {
            return (
                <div className="sett-paa-vent">
                    <Dialog
                        open={this.props.dialogOpen}
                        title="Gjenoppta sak"
                        actions={gjennopptaActions}
                    >
                    </Dialog>
                </div>
            )
        }

        return (
            <div className="sett-paa-vent">
                 <Dialog
                    open={this.props.dialogOpen}
                    title="Avslutt sak"
                    actions={actions}
                 >
                    <DatePickerNorwegian
                        floatingLabelText="Avsluttet dato"
                        value={this.state.avsluttet}
                        onChange={(e, date) => this.setState({avsluttet : date})}
                     />
                 </Dialog>
            </div>
        )
    }
}

export default AvsluttSak;
