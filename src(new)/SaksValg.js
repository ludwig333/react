import React from "react";
import { connect } from "react-redux";

import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";

import {
  openCloseDialog,
  updateSak,
  fetchOppstilling,
  snackbarMsg
} from "./modules/actions";

function sak() {
  return (
    decodeURIComponent(
      (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
        decodeURIComponent(location.search)
      ) || [null, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}

class SaksValg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.initalState = {};
  }

  submitChanges = () => {
    let state = JSON.parse(JSON.stringify(this.state));
    if (state.Avtalt_rentesats !== undefined) {
      state.Avtalt_rentesats =
        state.Avtalt_rentesats === 0
          ? 0
          : state.Avtalt_rentesats.replace(",", ".");
    }

    this.props.dispatch(openCloseDialog("SAKSVALG"));
    this.props.dispatch(snackbarMsg("Endrer saksvalg...", true));
    this.props
      .dispatch(
        updateSak(this.props.generellInfo.data.Nr, JSON.stringify(state))
      )
      .then(a => this.props.dispatch(fetchOppstilling(sak())))
      .then(a => this.props.dispatch(snackbarMsg("Endret saksvalg", true)));
  };

  componentDidMount() {
    const info = this.props.generellInfo.data;
    console.log("SaksValg", this.props.generellInfo.data);
    this.setState({
      Ingen_renter: info.Ingen_renter,
      Behandlingsterskel: info.Behandlingsterskel,
      Med_omkostninger_fra_hovedsak: info.Omkostninger_skyggesak,
      Med_saler_fra_hovedsak: info.Saler_skyggesak,
      Avdeling: info.avdeling,
      Saksnummer_i_retten: info.Saksnummer_i_retten,
      Saksnummer_hos_namsmann: info.Saksnummer_hos_namsmann,
      Avtalt_rentesats: info.Avtalt_rentesats,
      Avdrag_uten_giro: info.Avdrag_uten_giro
    });
  }

  render() {
    const info = this.props.generellInfo.data;

    const valgSkyggesak = [
      <Checkbox
        label="Ta med salær fra hovedsak"
        checked={this.state.Med_saler_fra_hovedsak}
        onCheck={(e, bool) => {
          this.setState({ Med_saler_fra_hovedsak: bool });
        }}
      />,
      <Checkbox
        label="Ta med omkostninger fra hovedsak"
        checked={this.state.Med_omkostninger_fra_hovedsak}
        onCheck={(e, bool) => {
          this.setState({ Med_omkostninger_fra_hovedsak: bool });
        }}
      />
    ];

    const actions = [
      <FlatButton
        label="Lukk"
        onTouchTap={e => this.props.dispatch(openCloseDialog("SAKSVALG"))}
      />,
      <FlatButton label="Lagre" onTouchTap={e => this.submitChanges()} />
    ];

    return (
      <Dialog
        title="Saksvalg"
        open={this.props.dialogOpen}
        actions={actions}
        contentStyle={{ width: "30%" }}
      >
        <TextField
          floatingLabelText="Behandlingsterskel"
          value={this.state.Behandlingsterskel}
          onChange={(e, str) =>
            this.setState({
              Behandlingsterskel: parseInt(str, 10),
              Behandlingsterskel_er_redigert: true
            })
          }
        />
        <TextField
          floatingLabelText="Avdeling"
          value={this.state.Avdeling}
          onChange={(e, str) => this.setState({ Avdeling: str })}
        />
        <TextField
          floatingLabelText="Saksnummer i tingrett"
          value={this.state.Saksnummer_i_retten}
          onChange={(e, str) => this.setState({ Saksnummer_i_retten: str })}
        />
        <TextField
          floatingLabelText="Saksnummer hos namsmann"
          value={this.state.Saksnummer_hos_namsmann}
          onChange={(e, str) => this.setState({ Saksnummer_hos_namsmann: str })}
        />
        <TextField
          floatingLabelText="Avtalt rentesats"
          value={this.state.Avtalt_rentesats}
          onChange={(e, str) => this.setState({ Avtalt_rentesats: str })}
        />
        <Checkbox
          label="Ikke beregn renter"
          checked={this.state.Ingen_renter}
          onCheck={(e, bool) => {
            this.setState({ Ingen_renter: bool });
          }}
        />
        {this.props.generellInfo.data.har_avdragsavtale ||
        this.props.generellInfo.data.har_gjeldsordning ? (
          <Checkbox
            label="Ikke send giro på avdrag"
            checked={this.state.Avdrag_uten_giro}
            onCheck={(e, bool) => {
              this.setState({ Avdrag_uten_giro: bool });
            }}
          />
        ) : null}

        <FlatButton
          label={`Overfør sak til ${
            this.props.generellInfo.data.Current_saksbehandler_navn
          }`}
          onTouchTap={e => {
            this.setState({
              Saksbehandler: this.props.generellInfo.data
                .Current_saksbehandler_nr
            });
          }}
        />
        {info.Skygger_sak !== "" ? valgSkyggesak : null}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const dialogOpen = state.openCloseDialog.SAKSVALG;
  const generellInfo = state.generellInfo;
  return {
    dialogOpen,
    generellInfo
  };
}

export default connect(mapStateToProps)(SaksValg);
