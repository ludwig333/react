import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

import { connect } from "react-redux";

import { opprettDebitornotat, openCloseDialog } from "./modules/actions";

const initialState = {
  Notat: ""
};

function sak() {
  return (
    decodeURIComponent(
      (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
        decodeURIComponent(location.search)
      ) || [null, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}

class NyttDebitornotat extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  opprettDebitorNotat = obj => {
    if (obj.Notat === "") {
      return;
    }
    this.props.dispatch(opprettDebitornotat(sak(), JSON.stringify(this.state)));
    this.state = initialState;
  };

  render() {
    const actions = [
      <FlatButton
        label="Avbryt"
        onTouchTap={e => this.props.dispatch(openCloseDialog("DEBITOR_NOTAT"))}
      />,
      <FlatButton
        label="Opprett"
        onTouchTap={e => this.opprettDebitorNotat(this.state)}
      />
    ];

    return (
      <div className="sett-paa-vent">
        <Dialog
          open={this.props.dialogOpen}
          title="Nytt notat på debitor"
          actions={actions}
        >
          <TextField
            autoFocus
            inputProps={{ autoFocus: true }}
            name="Notat"
            type="text"
            floatingLabelText="Notat"
            value={this.state.text}
            onChange={(e, str) => this.setState({ Notat: str })}
            multiLine={true}
          />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const dialogOpen = state.openCloseDialog.DEBITOR_NOTAT;
  return {
    dialogOpen
  };
}

export default connect(mapStateToProps)(NyttDebitornotat);
