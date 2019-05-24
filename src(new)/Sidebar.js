import React from "react";
import FooterToolbar from "./FooterToolbar";

import moment from "moment";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3
    };
  }

  handleChange = (event, index, value) => this.setState({ value });

  handleSearch = e => {
    // Enter has keycode 13
    if (e.keyCode === 13) {
      window.location.href = `/Finn?finn=${e.target.value}&Find=finn`;
    }
  };

  handleLogout(e) {
    window.location.href = `/?Logout=1sak=&kreditor=`;
  }
  
  logo(kommuneNr){
  if(kommuneNr > 2500 || kommuneNr == 2500){
   return "/MP/icons/logo_eik_notxt.png";
  }
  else if(kommuneNr < 2500){
    return "/MP/icons/logo_eik.png";
  }
  }

  render() {
    console.log("sidebar");
    const data = this.props.info.data;
//console.log(data['kommuneNr']);
    const sakAktiv = () => {
      if (!data.Avsluttet) return;

      if (data.Avsluttet.includes("0000")) {
        if (data.langtid) {
          return (
            <div className="top-toolbar-info">
              <div
                className="keys"
                style={{ color: "#ffc456", fontWeight: "bolder" }}
              >
                {" "}
                Saken er på langtidsovervåking{" "}
              </div>
            </div>
          );
        }

        if (data.paa_vent === "True") {
          return (
            <div className="top-toolbar-info">
              <div
                className="keys"
                style={{ color: "#ffc456", fontWeight: "bolder" }}
              >
                {" "}
                Saken er på vent{" "}
              </div>
            </div>
          );
        }

        if (data.har_avdragsavtale) {
          return (
            <div className="top-toolbar-info">
              <div
                className="keys"
                style={{ color: "#ffc456", fontWeight: "bolder" }}
              >
                {" "}
                Aktiv avdragsavtale{" "}
              </div>
            </div>
          );
        }

        if (data.har_gjeldsordning) {
          return (
            <div className="top-toolbar-info">
              <div
                className="keys"
                style={{ color: "#ffc456", fontWeight: "bolder" }}
              >
                {" "}
                Aktiv gjeldsordning{" "}
              </div>
            </div>
          );
        }

        return (
          <div className="top-toolbar-info">
            <div
              className="keys"
              style={{ color: "#b7ffda", fontWeight: "bolder" }}
            >
              {" "}
              Saken er aktiv{" "}
            </div>
          </div>
        );
      }

      return (
        <div className="top-toolbar-info">
          <div
            className="keys"
            style={{ color: "#ffb6b2", fontWeight: "bolder" }}
          >
            {" "}
            Saken er avsluttet{" "}
          </div>
          <div className="values">
            {" "}
            {moment(data["Avsluttet"]).format("L")}{" "}
          </div>
        </div>
      );
    };

    const logoStyle = {
      height: "60px",
      width: "auto",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "25px",
      display: "block"
    };

    const detailsStyle = {
      marginTop: "30px",
      marginLeft: "30px"
    };

    return (
      <div>

        <a href="/">

          <img src={this.logo(data['kommuneNr'])} role="presentation" style={logoStyle} />

        </a>

        <div style={detailsStyle}>
          {/*<RaisedButton
            onTouchTap={this.handleLogout}
          >
            Logg ut
          </RaisedButton>
          */}
          {sakAktiv()}
          {/**
          <br/>
          <div className="top-toolbar-info">
            <div className="keys"> Saksbehandler </div>
            <div className="values"> {data['Saksbehandler']} </div>
          </div>
          <br/>
          <div className="top-toolbar-info">
            <div className="keys"> Saksnummer</div>
            <div className="values"> {data['Nr']} </div>
          </div>
          <br/>
          <div className="top-toolbar-info">
            <div className="keys"> Kreditor </div>
            <div className="values"> {data['Kreditor']} </div>
          </div>
          <br/>
        */}

      {data["Samlesaknr"] === "" ||
          data["Samlesaknr"] === undefined ? null : (
            <div className="top-toolbar-info">
              <div className="keys" style={{ color: "yellow" }}>
                {" "}
                <a
                  style={{ color: "yellow" }}
                  href={`/sak?sak=${data["Samlesaknr"]}`}
                >
                  {" "}
                 <div> {`Tilhører samlesak`} </div>
                 <div> {data["Samlesaknr"]}{" "} </div>
                </a>{" "}
              </div>
            </div>
          )}

      {
        (() => {
          if(data["Skygger_sak"] === 7) {
            return(
            <div className="top-toolbar-info">
              <div className="keys" style={{ color: "yellow" }}>
                {" "}
                Samlesak{" "}
              </div>
            </div>
            )
          }
          else if(data["Skygger_sak"] === 2){
            return(
            <div className="top-toolbar-info">
              <div className="keys" style={{ color: "yellow" }}>
                {" "}
                Skyggesak{" "}
              </div>
            </div> 
            )           
          }
          else{
          }
        })()
      }

          {data["Kumulert_til"] === "" ||
          data["Kumulert_til"] === undefined ? null : (
            <div className="top-toolbar-info">
              <div className="keys" style={{ color: "yellow" }}>
                {" "}
                Kumulert inn i sak{" "}
              </div>
              <div className="values">
                {" "}
                <a
                  style={{ color: "white" }}
                  href={`/sak?sak=${data["Kumulert_til"]}`}
                >
                  {" "}
                  {data["Kumulert_til"]}{" "}
                </a>{" "}
              </div>
            </div>
          )}
          {/**<TextField
            hintText="Finn"
            inputStyle={{color: "white"}}
            hintStyle={{color: "#bababa"}}
            onKeyDown={this.handleSearch}
            style={{width : "85%"}}
          />
          */}
          <FooterToolbar />
        </div>
      </div>
    );
  }
}

export default Sidebar;
