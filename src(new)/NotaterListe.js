import React, { Component } from "react";
import "./KravOppstilling.css";
import moment from "moment";
import FontAwesome from "react-fontawesome";

import EikCard from "./generics/EikCard";

import InputValidation from "./generics/InputValidation";

function getURLParameter() {
  return (
    decodeURIComponent(
      (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
        decodeURIComponent(location.search)
      ) || [null, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}

class NotaterListe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sak: getURLParameter()
    };
    this.fv = new InputValidation(this.state);
  }

  render() {
    if (this.props.notater.length === 0) return null;

    const pdfIcon = nr => {
      return (
        <FontAwesome
          name="file-pdf-o"
          size="2x"
          onClick={() =>
            window.open(`/Notat_vedlegg?sak=${this.state.sak}&notat=${nr}`)
          }
        />
      );
    };

    const notater = this.props.notater
      .slice()
      .sort((a, b) => (a.Nr > b.Nr ? -1 : 1))
      .map(o => {
        return (
          <tr>
            <td>
              <a href={`/Notat?sak=${o.Sak}&notat=${o.Nr}`}>
                {" "}
                {moment(o.Dato).format("L")}{" "}
              </a>
            </td>
            <td> {o.Saksbehandler} </td>
            <td> {o.Notat} </td>
            <td>
              {" "}
              {o.Forfall.includes("0000")
                ? ""
                : moment(o.Forfall).format("L")}{" "}
            </td>
            <td> {o.pdf === "true" ? pdfIcon(o.Nr) : ""} </td>
          </tr>
        );
      });

    return (
      <EikCard
        title="Notater"
        subtitle={`${this.props.notater.length} notater på saken.`}
        expanded={this.props.notater.length < 30}
      >
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th> Dato </th>
              <th> Saksbehandler </th>
              <th> Notat </th>
              <th> Forfall </th>
              <th> PDF </th>
            </tr>
          </thead>
          <tbody>{notater}</tbody>
        </table>
      </EikCard>
    );
  }
}

export default NotaterListe;
