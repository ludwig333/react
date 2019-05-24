import React, { Component } from 'react';

import TextField from 'material-ui/TextField';

class TopBar extends Component {

  handleSearch = (e) => {
    // Enter has keycode 13
    if (e.keyCode === 13) {
       window.location.href = `/Finn?finn=${e.target.value}&Find=finn`;
    }
  }

 finn = (e) => {
  window.open("Finn?finn="+e+"&Find=finn",'_self');
}

handleKeyPress = (e) =>{
 var key=e.keyCode || e.which;
  if (key==13){
     this.finn(document.getElementById("sok").value);
  }
}

logout = (e) =>{
  window.location='/?Logout=1&sak=&kreditor=';
}

allfinn = (e) =>{
  window.location='/Finn?finn=@&Find=finn';
}
  render() {
 console.log("topbar");
    const data = this.props.info.data;

    const styleKeys = {
      fontSize : ".7rem",
      fontFamily : "Roboto, sans-serif",
      marginRight : "10px",
      color : "white"
    }

    const styleVals = {
      fontSize : ".8rem",
      fontFamily : "Roboto, sans-serif",
      color : "white"
    }

    const styleKeyVals = {
      display:"inline-block",
      marginRight : "15px",
      marginLeft : "15px"

    }

    const stylebuttonVals = {
      display:"inline-block",
      marginRight : "15px",
      marginLeft : "15px",
      color:data['backgroundColor'],
      paddingTop:"6px",
      paddingBottom:"6px",
      paddingRight:"10px",
      paddingLeft:"10px",
      backgroundColor:"white",
      cursor:"pointer",
      fontWeight:"500",
      fontSize:"12px",
      fontFamily:"sans-serif"     
    }

    return (
    <div style={{display: "inline-block"}}>
      <div>
      {/**
        data['sms_ident'] !== "" ?
        <div style={styleKeyVals}>
          <div style={styleKeys}> Fotavtrykk </div>
          <div style={styleVals}> {data['sms_ident']} </div>
        </div> :
        null
      */}
      {
        data['kommuneNr'] > 2500 ?
        <div style={styleKeyVals}>
          <div style={styleKeys}> Bedrift : </div>
          <div style={styleVals}> {data['Kommune']} </div>
        </div> :
        <div style={styleKeyVals}>
          <div style={styleKeys}> Kommune : </div>
          <div style={styleVals}> {data['Kommune']} </div>
        </div>
        
      }    

      <div style={styleKeyVals}>
          <div style={styleKeys}> Kreditor : </div>
          <div style={styleVals}> {data['Kreditor']} </div>
      </div>

      <div style={styleKeyVals}>
        <div style={styleKeys}> Saksnummer :</div>
        <div style={styleVals}> {data['Nr']} </div>
      </div>
        <div style={styleKeyVals}>
          <div style={styleKeys}> Saksbehandler : </div>
          <div style={styleVals}> {data['Saksbehandler']} </div>
        </div>

      <div style={styleKeyVals}>
          <div style={styleKeys}> Søk </div>
          <div style={styleVals}>
           <input onKeyDown={this.handleSearch} type="text" style={{fontSize:".8rem",width:"100px"}} id="sok" />
           </div>
      </div>      


        <div style={styleKeyVals}>
          <div style={styleKeys}>  </div>
          <div style={stylebuttonVals} onClick={this.allfinn}> 
              <span> Vis alle saker </span>        
          </div>
        </div> 

        <div style={styleKeyVals}>
          <div style={styleKeys}>  </div>
          <div style={stylebuttonVals} onClick={this.logout}> <span> Logg ut </span> </div>
        </div>        
      </div>

    </div>
    )
  }
}

export default TopBar;
