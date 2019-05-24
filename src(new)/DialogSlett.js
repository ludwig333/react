import React from 'react'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { connect } from 'react-redux';

import {
  openCloseDialog
} from './modules/actions';

class DialogSlett extends React.Component {

  render() {
    const actions = [
      <FlatButton
        label="Avbryt"
        onTouchTap={e => this.props.dispatch(openCloseDialog(this.props.dialogName))}
      />,
      <FlatButton
        label="Slett"
        onTouchTap={e => this.props.dispatch(this.props.deleteAction).then(this.props.dispatch(openCloseDialog(this.props.dialogName)))}
      />
    ]

    return (

      <Dialog
        title={this.props.tittel}
        open={this.props.dialogOpen}
        actions={actions}
      >
        <h1> Er du helt sikker på dette? </h1>
      </Dialog>
    )
  }

}

export default connect()(DialogSlett);
