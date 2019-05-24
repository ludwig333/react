import React from "react";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import FontIcon from "material-ui/FontIcon";
import NavigationExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import MenuItem from "material-ui/MenuItem";
import DropDownMenu from "material-ui/DropDownMenu";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";

import EndreSaksgang from "./EndreSaksgang";

import moment from "moment";

import "./TopToolbar.css";

export default class TopToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange = (event, index, value) => this.setState({ value });

  handleSearch(e) {
    // Enter has keycode 13
    if (e.keyCode === 13) {
      window.location.href = `/Finn?finn=${e.target.value}&Find=finn`;
    }
  }

  handleLogout(e) {
    window.location.href = `http://localhost:8080/?Logout=1sak=&kreditor=`;
  }

  render() {
    const data = this.props.info.data;

    return (
      <Toolbar
        className="row"
        style={{
          backgroundColor: "white",
          marginLeft: "30px",
          marginRight: "30px"
        }}
      >
        <ToolbarGroup className="col-lg-1 col-md-1" firstChild={true}>
          <img
            src="/Bilder/logo.png"
            style={{ height: "50px", width: "auto" }}
          />
        </ToolbarGroup>
        <ToolbarGroup className="col-lg-7 col-md-8">
          <div className="top-toolbar-info">
            <div className="keys"> Saksbehandler </div>
            <div className="values"> {data["Saksbehandler"]} </div>
          </div>
          <div className="top-toolbar-info">
            <div className="keys"> Saksnummer </div>
            <div className="values"> {data["Nr"]} </div>
          </div>
          <div className="top-toolbar-info">
            <div className="keys"> Kreditor </div>
            <div className="values"> {data["Kreditor"]} </div>
          </div>
          {data["Skygger_sak"] === "" ||
          data["Skygger_sak"] === undefined ? null : (
            <div className="top-toolbar-info">
              <div className="keys" style={{ color: "yellow" }}>
                {" "}
                Skygger sak{" "}
              </div>
              <div className="values">
                {" "}
                <a
                  style={{ color: "white" }}
                  href={`/sak?sak=${data["Skygger_sak"]}`}
                >
                  {" "}
                  {data["Skygger_sak"]}{" "}
                </a>{" "}
              </div>
            </div>
          )}
          {data["Kumulert_til"] === "" ||
          data["Kumulert_til"] === undefined ? null : (
            <div className="top-toolbar-info">
              <div className="keys" style={{ color: "yellow" }}>
                {" "}
                Kumulert inn i sak{" "}
              </div>
              <div className="values"> {data["Kumulert_til"]} </div>
            </div>
          )}
        </ToolbarGroup>
        <ToolbarGroup className="col-lg-3 col-md-3">
          <TextField
            hintText="Finn"
            inputStyle={{ color: "white" }}
            hintStyle={{ color: "#bababa" }}
            onKeyDown={this.handleSearch}
          />
          <RaisedButton onTouchTap={this.handleLogout}>Logg ut</RaisedButton>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
