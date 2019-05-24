import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

import { openCloseDialog, updateSamskyldner } from "./modules/actions";

function sak() {
  return (
    decodeURIComponent(
      (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
        decodeURIComponent(location.search)
      ) || [null, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}

class SamskyldnerEdit extends React.Component {
  state = {
    typeSamskyldnerValue: null,
    samskyldner: [],
    loading: true
  };

  componentDidMount() {
    fetch(`/4daction/API_samskyldner_get?sak=${sak()}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(json => this.setState({ samskyldner: json, loading: false }))
      .catch(err => console.log(err));
  }

  updateSamskyldner = (sak, json) => {
    this.props.dispatch(openCloseDialog("ENDRE_SAMSKYLDNER"));
    this.props.dispatch(updateSamskyldner(sak, JSON.stringify(json)));
  };

  render() {
    if (this.state.loading) return null;
    if (this.props.generellInfo.loading) return null;
    if (this.props.generellInfo.data.skygger_sak.length === 0) return null;

    if (this.state.typeSamskyldnerValue === null) {
      this.setState({
        typeSamskyldnerValue: this.state.samskyldner[0].Samskyldnertype
      });
    }

    const actions = [
      <FlatButton
        label="Lukk"
        onTouchTap={() =>
          this.props.dispatch(openCloseDialog("ENDRE_SAMSKYLDNER"))
        }
      />,
      <FlatButton
        label="Lagre"
        onTouchTap={() =>
          this.updateSamskyldner(sak(), {
            samskyldnertype: this.state.typeSamskyldnerValue,
            samskyldner: this.state.samskyldner[0].Nr
          })
        }
      />
    ];

    return (
      <div>
        <RaisedButton
          label="Rediger samskyldner"
          onTouchTap={() =>
            this.props.dispatch(openCloseDialog("ENDRE_SAMSKYLDNER"))
          }
        />
        <Dialog
          title="Endre samskyldner"
          open={this.props.dialogOpen}
          actions={actions}
        >
          <SelectField
            hintText="Samskyldertype"
            value={this.state.typeSamskyldnerValue}
            onChange={(e, i, v) => this.setState({ typeSamskyldnerValue: v })}
          >
            <MenuItem value={7} primaryText="Hjemmelshaver" />
            <MenuItem value={5} primaryText="Arbeidsgiver" />
            <MenuItem value={1} primaryText="Medskyldner" />
          </SelectField>
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const dialogOpen = state.openCloseDialog.ENDRE_SAMSKYLDNER;
  const generellInfo = state.generellInfo;
  return {
    dialogOpen,
    generellInfo
  };
}

export default connect(mapStateToProps)(SamskyldnerEdit);
