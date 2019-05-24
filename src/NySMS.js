import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

import { connect } from "react-redux";
import { opprettSMS, openCloseDialog } from "./modules/actions";

const initialState = {
  Melding: ""
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

class NySMS extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  opprettSMS = obj => {
    if (obj.Melding === "") {
      return;
    }
    this.props.dispatch(opprettSMS(sak(), JSON.stringify(this.state)));
    this.state = initialState;
  };

  fyllInnBetalingsinfo = () => {
    this.setState({
      Melding: `Saksnummer ${this.props.generellInfo.data.Nr}
Beløp: ${this.props.oppstilling.data.Saldo}
Konto: ${this.props.oppstilling.data.Konto}
KID: ${this.props.oppstilling.data.KID}
Denne SMS'en kan ikke besvares.
Med vennlig hilsen ${this.props.generellInfo.data.Kommune}`
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="Fyll inn betalingsinfo"
        onTouchTap={e => {
          this.fyllInnBetalingsinfo();
        }}
      />,
      <FlatButton
        label="Avbryt"
        onTouchTap={e => this.props.dispatch(openCloseDialog("NY_SMS_DIALOG"))}
      />,
      <FlatButton label="Send" onTouchTap={e => this.opprettSMS(this.state)} />
    ];

    return (
      <div className="sett-paa-vent">
        <Dialog open={this.props.dialogOpen} title="Ny SMS" actions={actions}>
          <TextField
            autofocus
            name="SMS"
            type="text"
            floatingLabelText="Skriv tekstmelding her"
            value={this.state.Melding}
            onChange={(e, str) => this.setState({ Melding: str })}
            multiLine={true}
          />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const dialogOpen = state.openCloseDialog.NY_SMS_DIALOG;
  const debitorInfo = state.debitor;
  const generellInfo = state.generellInfo;
  const oppstilling = state.oppstilling;
  return {
    dialogOpen,
    debitorInfo,
    generellInfo,
    oppstilling
  };
}

export default connect(mapStateToProps)(NySMS);
