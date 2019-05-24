import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import TiltakButtons from "./TiltakButtons";
import NyttTiltak from "./NyttTiltak";
import EndreSaksgang from "./EndreSaksgang";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import moment from "moment";

import EikCard from "./generics/EikCard";
import Dokumentpakke from "./Dokumentpakke";

function sak() {
  return (
    decodeURIComponent(
      (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
        decodeURIComponent(location.search)
      ) || [null, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}

class TiltaksListe extends Component {
  constructor(props) {
    super(props);
    console.log("generalinfo xxx");
console.log(this.props.generellInfo);
    this.state = {
      tiltak: 0,
      deleteDialogOpen: false,
      nyttTiltakDialogOpen: false
    };

    this.openCreateTiltakDialog = this.openCreateTiltakDialog.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
  }

  openCreateTiltakDialog(e) {
    e.preventDefault();
    this.setState({
      nyttTiltakDialogOpen: !this.state.nyttTiltakDialogOpen
    });
  }

  openDeleteDialog(e, tiltakNum) {
    e.preventDefault();
    this.setState({
      deleteDialogOpen: true,
      tiltak: tiltakNum
    });
  }

  closeDeleteDialog(e, should_delete) {
    e.preventDefault();
    if (should_delete) {
      this.props.deleteTiltak(this.state.tiltak);
    }
    this.setState({
      deleteDialogOpen: false,
      tiltak: 0
    });
  }

  render() {
    const PDFikon = (antPDF, tiltak, skrevet) =>
      Array(antPDF)
        .fill()
        .map((a, idx) => {
          return (
            <FontAwesome
              name="file-pdf-o"
              size="2x"
              style={
                skrevet
                  ? { color: "black", cursor: "pointer" }
                  : { color: "grey", cursor: "pointer" }
              }
              onClick={() =>
                window.open(
                  "/Saktiltak_side?Tiltak=" + tiltak + "&Side=" + (idx + 1)
                )
              }
            />
          );
        });

    const hasAvholdt = this.props.tiltak.reduce(
      (p, c, idx) =>
        p || (c.hasOwnProperty("Avholdt") && !c.Avholdt.includes("0000")),
      false
    );
    const hasForkynt = this.props.tiltak.reduce(
      (p, c, idx) =>
        p || (c.hasOwnProperty("Forkynt") && !c.Forkynt.includes("0000")),
      false
    );

    const hasDigipostStatus = this.props.tiltak.reduce(
      (p, c, idx) =>
        p || (c.hasOwnProperty("Digipost") && c.Digipost.includes("SENDT")),
      false
    );

    const tiltak = this.props.tiltak
      .filter(obj => !obj.upcoming)
      .filter(obj => !obj.Navn.includes("Avdrag"))
      .slice()
      .reverse()
      .slice()
      .sort((a, b) => new Date(b.Dato).getTime() - new Date(a.Dato).getTime())
      .map(o => {
        return (
          <tr>
            <td>
              {" "}
              <a href={`sakstiltak?Sak=${sak()}&Tiltak=${o.Tiltak}`}>
                {" "}
                {o.Kode}{" "}
              </a>{" "}
            </td>
            <td> {PDFikon(o.AntPdf, o.Tiltak, o.Skrevet)} </td>
            <td> {o.Navn} </td>
            <td> {o.Saksbehandler} </td>
            <td> {moment(o.Dato).format("L")} </td>
            <td>
              {" "}
              {o.Forfall.includes("0000")
                ? ""
                : moment(o.Forfall).format("L")}{" "}
            </td>
            <td>
              {" "}
              {o.Forkynt.includes("0000")
                ? ""
                : moment(o.Forkynt).format("L")}{" "}
            </td>
            <td>
              {" "}
              {o.Avholdt.includes("0000")
                ? ""
                : moment(o.Avholdt).format("L")}{" "}
            </td>
            {hasDigipostStatus ? <td> {o.Digipost} </td> : null}
            <td>
              <a>
                <FontAwesome
                  name="trash"
                  size="2x"
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={e => this.openDeleteDialog(e, o.Tiltak)}
                />
              </a>
            </td>
          </tr>
        );
      });

    const styleKommende = {
      color: "#7c7c7c"
    };

    const kommende = this.props.tiltak
      .filter(obj => obj.upcoming)
      .slice()
      .reverse()
      .map(o => {
        return (
          <tr>
            <td style={styleKommende}> {o.prosesstrinn} </td>
            <td />
            <td style={styleKommende}> {o.prosesstrinn_navn} </td>
            <td />
            <td />
            <td />
            <td />
            <td />
            {hasDigipostStatus ? <td /> : null}
            <td />
          </tr>
        );
      });

    const actions = [
      <FlatButton
        label="Avbryt"
        primary={true}
        onTouchTap={e => this.closeDeleteDialog(e, false)}
      />,
      <FlatButton
        label="Slett"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={e => this.closeDeleteDialog(e, true)}
      />
    ];

    const numTiltak = this.props.tiltak
      .filter(obj => !obj.upcoming)
      .filter(obj => !obj.Navn.includes("Avdrag")).length;

    return (
      <EikCard
        title="Tiltak"
        subtitle={`${numTiltak} tiltak på saken.`}
        expanded={numTiltak < 20}
        actions={[<TiltakButtons />, <Dokumentpakke />, <EndreSaksgang />]}
      >
        <table className="table table-striped">
          <thead>
            <tr>
              <th> Tiltak </th>
              <th> PDF </th>
              <th> Betegnelse </th>
              <th> Saksbehandler </th>
              <th> Dato </th>
              <th> Forfall </th>
              <th> Forkynt </th>
              <th> Avholdt </th>
              {hasDigipostStatus ? <th>Digipost</th> : null}
              <th> Slett </th>
            </tr>
          </thead>
          <tbody>
            {kommende}
            {tiltak}
          </tbody>
        </table>
        <NyttTiltak
          trinn={this.props.trinn}
          openCloseDialog={this.openCreateTiltakDialog}
          nyttTiltakDialogOpen={this.state.nyttTiltakDialogOpen}
        />
        <Dialog
          title="Er du helt sikker?"
          actions={actions}
          modal={false}
          open={this.state.deleteDialogOpen}
        />
      </EikCard>
    );
  }
}

function mapStateToProps(state) {
  const generellInfo = state.generellInfo;
  return {
    generellInfo
  };
}

export default connect(mapStateToProps)(TiltaksListe);

