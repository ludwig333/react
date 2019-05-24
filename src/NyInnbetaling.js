import React from "react";
import moment from "moment";

import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import DatePickerNorwegian from "./generics/DatePickerNorwegian.js";
import Toggle from "material-ui/Toggle";

const initialState = {
  belop: 0,
  dato: new Date(moment.now()),
  ikke_bokfoeres: true,
  tekst: "",
  err: "",
  valid: { belop: false },
  empty: { belop: false }
};

class NyInnbetaling extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, initialState);
  }

  saveInnbetaling(e) {
    e.preventDefault();
    if (this.state.belop === 0 || this.state.belop === "") {
      this.setState({ err: "Beløpet kan ikke være null" });
      return;
    }

    this.setState(
      { belop: this.state.belop.toString().replace(".", ",") },
      () => {
        this.props.dialogOpenClose("NY_INNBETALING");
        this.props.msg("Oppretter innbetaling...");
        this.props.createInnbetaling(JSON.stringify(this.state)).then(() => {
          this.setState(Object.assign(initialState));
        });
      }
    );
  }

  handleInnbetaling = (e, str) => {
    e.preventDefault();
    str = str.replace(",", ".");
    if (!isNaN(parseInt(str, 10))) {
      this.setState({ belop: parseInt(str, 10) });
    }

    if (str === "") {
      this.setState({ belop: "" });
    }
  };

  checkValid = field_name =>
    this.state.valid[field_name] ? "" : "Ugyldig verdi";

  checkNotEmpty = field_name =>
    this.state.empty[field_name] ? "" : "Må fylles ut";

  validation = field_name => {
    if (this.state.empty[field_name]) {
      return this.checkValid(field_name);
    }
    return this.checkNotEmpty(field_name);
  };

  validateObj = obj => Object.keys(obj).reduce((acc, x) => obj[x] && acc, true);
  isValidated = states =>
    states.reduce((acc, x) => acc && this.validateObj(x), true);

  validateEmpty = (field_name, str) => {
    let empty = { ...this.state.empty };
    empty[field_name] = str !== "" && str !== "0";
    this.setState({ empty });
  };

  validateType = (field_name, str) => {
    let valid = { ...this.state.valid };
    valid[field_name] = !isNaN(str.replace(",", "."));
    this.setState({ valid });
  };

  setAndValidate = funcs => (field_name, str) => {
    let o = {};
    o[field_name] = str;
    this.setState({ ...o });
    funcs.forEach(f => {
      f(field_name, str);
    });
  };

  validateEmpty = this.setAndValidate([this.validateEmpty]);
  validateTypeAndEmpty = this.setAndValidate([
    this.validateEmpty,
    this.validateType
  ]);

  render() {
    let invalid = !this.isValidated([this.state.empty, this.state.valid]);

    const buttons = [
      <FlatButton
        label="Avbryt"
        onTouchTap={e => this.props.dialogOpenClose("NY_INNBETALING")}
      />,
      <FlatButton
        label="Lagre"
        disabled={invalid}
        onTouchTap={e => this.saveInnbetaling(e)}
      />
    ];

    const errMsg = () => {
      return <div style={{ color: "red" }}>{this.state.err}</div>;
    };

    return (
      <Dialog
        actions={buttons}
        open={this.props.dialogOpen}
        title="Registrer innbetaling"
      >
        Beløp:
        <br />
        <TextField
          autoFocus
          errorText={this.validation("belop")}
          value={this.state.belop}
          onChange={(e, str) => this.validateTypeAndEmpty("belop", str)}
        />
        <br />
        Tekst:
        <br />
        <TextField
          value={this.state.tekst}
          onChange={(e, str) => this.setState({ tekst: str })}
        />
        <br />
        Dato:
        <br />
        <DatePickerNorwegian
          value={this.state.dato}
          onChange={(e, date) => this.setState({ dato: date })}
        />
        <br />
        <Toggle
          label="Skal ikke bokføres"
          onToggle={(e, bool) => this.setState({ ikke_bokfoeres: bool })}
          defaultToggled={this.state.ikke_bokfoeres}
        />
        {this.state.err === "" ? errMsg : null}
      </Dialog>
    );
  }
}

export default NyInnbetaling;
