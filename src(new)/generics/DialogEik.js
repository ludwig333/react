import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import {
    opencloseDialog
} from '../modules/'

// Required props
// "open" -> bool
// "title" -> String
// 

class DialogEik extends React.Component {

    render() {

        const buttons = this.props.actions.map(a => {
            return <RaisedButton label={a.labelName} onTouchTap={a.handler} />
        })

        return (
            <Dialog
                title={this.props.title}
                open={this.props.open}
                actions={buttons}
            >
                {this.props.children}
            </Dialog>
        )
    }

}

export default DialogEik;