import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import AutoComplete from "material-ui/AutoComplete";
import FlatButton from "material-ui/FlatButton";
import FyllInnTiltak from "./FyllInnTiltak";

import { connect } from "react-redux";

import {
  fetchProsesstrinn,
  updateTiltak,
  createTiltak,
  stepNext,
  resetSteps,
  snackbarMsg
} from "./modules/actions";

import "./NyttTiltak.css";

class NyttTiltak extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nynorsk: false,
      dataShow: [],
      showWindow: "PICK_PROSESSTRINN",
      title: "Velg prosesstrinn"
    };
  }

  sak() {
    return (
      decodeURIComponent(
        (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
          decodeURIComponent(location.search)
        ) || [null, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  }

  selectProsesstrinn = (val, idx) => {
    if (idx === -1) {
      return;
    }
    this.hentProsesstrinn(this.props.prosesstrinnList.data[idx]["Kode"]);
  };

  hentProsesstrinn(prosesstrinn) {
    if (prosesstrinn.includes("+")) {
      this.setState({ nynorsk: true });
    }

    prosesstrinn = prosesstrinn.replace("+", "");
    this.props
      .dispatch(
        fetchProsesstrinn({ prosesstrinn: prosesstrinn, sak: this.sak() })
      )
      .then(a => this.props.dispatch(stepNext()));
  }

  filterAutoComplete(searchText, key) {
    return (
      key["Kode"] +
      key["Name"] +
      "".toLowerCase().includes(searchText.toLowerCase())
    );
  }

  closeDialog = e => {
    this.props.dispatch(resetSteps());
    this.props.dialogOpenClose("NYTT_TILTAK");
    this.setState({ title: "Velg prosesstrinn" });
  };

  createTiltak = e => {
    e.preventDefault();
    let tiltakToCreate = {};
    this.props.prosesstrinn.data[1].forEach(key => {
      tiltakToCreate[key] =
        this.props.updateTiltak[key] === undefined
          ? ""
          : this.props.updateTiltak[key];
    });

    if (tiltakToCreate.Melding.melding !== undefined) {
      tiltakToCreate.Melding = tiltakToCreate.Melding.melding;
    }

    this.props.dispatch(snackbarMsg("Oppretter tiltak..."));
    this.props
      .dispatch(
        createTiltak(
          this.sak(),
          JSON.stringify(tiltakToCreate),
          `${this.props.prosesstrinn.data[0][0]["Kode"]}${
            this.state.nynorsk ? "+" : ""
          }`
        )
      )
      .then(() => {
        this.closeDialog();
        this.props.dispatch(snackbarMsg("Opprettet tiltak"));
      });
  };

  fillInTiltak = (str, keyName) => {
    this.props.dispatch(updateTiltak(str, keyName));
  };

  setNewTitle = str => {
    this.setState({ title: str });
  };

  render() {
    const { prosesstrinn, prosesstrinnList } = this.props;
    const style = {
      margin: 12
    };

    const selectProsesstrinn = (
      <AutoComplete
        autoFocus
        ref={input => {
          this.nameInput = input;
        }}
        hintText="Søk etter tiltak"
        listStyle={{ maxHeight: 400, overflow: "auto" }}
        dataSource={prosesstrinnList.data.map(
          a => a["Kode"] + " - " + a["Navn"]
        )}
        filter={AutoComplete.caseInsensitiveFilter}
        onUpdateInput={this.handleUpdateInput}
        fullWidth={true}
        onNewRequest={this.selectProsesstrinn}
      />
    );

    const createTiltak = (
      <div>
        <FyllInnTiltak
          setNewTitle={this.setNewTitle}
          valgtTrinn={prosesstrinn.data}
          fillInTiltak={this.fillInTiltak}
        />
      </div>
    );

    const whichView = () => {
      switch (this.props.stepper) {
        case 0:
          return selectProsesstrinn;
        case 1:
          return createTiltak;
        default:
          return null;
      }
    };

    const buttons = (
      <div className="btn-nytt-tiltak">
        <FlatButton label="Lukk" onTouchTap={this.closeDialog} style={style} />
        {this.props.stepper === 1 ? (
          <FlatButton
            keyboardFocused={true}
            label="Lagre"
            onTouchTap={this.createTiltak}
            style={style}
          />
        ) : null}
      </div>
    );

    return (
      <Dialog
        autoScrollBodyContent={true}
        title={this.state.title}
        modal={false}
        open={this.props.dialogOpen}
      >
        {whichView()}
        {buttons}
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  const { prosesstrinn, prosesstrinnList, updateTiltak, stepper } = state;
  return {
    prosesstrinn,
    prosesstrinnList,
    updateTiltak,
    stepper
  };
}

export default connect(mapStateToProps)(NyttTiltak);
