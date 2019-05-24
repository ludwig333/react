import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import {
    snackbarMsg
} from './modules/actions';

// material-ui

import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import './Dokumentpakke.css';

function sak() {
  return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;  // eslint-disable-line
}

class Dokumentpakke extends Component {

  state = {
    tiltak : [],
    tiltakChecked : [],
    open : false,
    documentLoading : false
  }

  componentDidMount() {
    fetch(`/4daction/dokumentpakke?sak=${sak()}`, {
        credentials : 'include'
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      this.setState({
        tiltak : json
      })
    })
  }

  handleCheck = (e, tiltaknr) => {
    console.log(e.target.checked);
    if (e.target.checked) {
      this.setState({tiltakChecked : this.state.tiltakChecked.concat(tiltaknr)})
    } else {
      this.setState({tiltakChecked : this.state.tiltakChecked.filter(nr => tiltaknr != nr)})
    }
  }

  generateDokumentpakke = (e) => {
    this.setState({documentLoading : true, open : false})
    this.props.dispatch(snackbarMsg("Oppretter dokumentpakke..."))
    fetch("/4daction/dokumentpakke_merge", {
      method : 'POST',
      body : JSON.stringify(this.state.tiltakChecked),
      credentials : 'include'
    })
    .then(r => r.blob())
    .then(blob => {

        var newBlob = new Blob([blob], {type: "application/pdf"})
      
        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(newBlob);
          return;
        } 
      
        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.
        const data = window.URL.createObjectURL(newBlob);
        var link = document.createElement('a');
        link.href = data;
        link.download="file.pdf";
        link.click();
        setTimeout(function(){
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
        }, 100)
        this.setState({documentLoading : false})
        this.props.dispatch(snackbarMsg("Dokumentpakke produsert"))
    })
  }

  render() {

    //if (!sak().includes("1924-")) return null;

    let res = this.state.tiltak;

    if (res.length === 0) return null;

    let tiltak = res.tiltak;

    const table = (tiltak_liste, sak, catIdx, category) => (
      <tbody>
            {tiltak_liste.sort((a,b) => b.Nr-a.Nr).map((tiltak, idx) => {
              return (
                <tr key={idx}>
                  <td> <b> {idx === 0 ? category : null} </b> </td>
                  <td> {idx === 0 ? sak.Avsluttet.includes("0000") ? null : moment(sak.Avsluttet).format("L") : null} </td>
                  <td> {idx === 0 ? sak.Nr : null} </td>
                  <td> {tiltak.Navn} </td>
                  <td> {tiltak.Prosesstrinn} </td>
                  <td> {moment(tiltak.Dato).format('L')} </td>
                  <td> {tiltak.Forfall.includes("0000") ? "" : moment(tiltak.Forfall).format("L")} </td>
                  <td> <Checkbox checked={this.state.tiltakChecked.includes(tiltak.Nr)} onCheck={e => this.handleCheck(e, tiltak.Nr)} /> </td>
                </tr>
            )
        })}
      </tbody>
    )

    const tilhorende_saker = (navn, key) => {
      console.log(res[key])
      return (
          res[key].length === 0 ? null : res[key].map((sak, catIdx) => table(tiltak.filter(t => t.Sak === sak.Nr), sak, catIdx, navn))
      )
    } 

    const actions = [
      <FlatButton
        label="Avbryt"
        onClick={e => this.setState({open : !this.state.open})}
      />,
      <FlatButton
        label={this.state.documentLoading ? "Lager pakke..." : "Produser dokumentpakke"}
        disabled={this.state.documentLoading || this.state.tiltakChecked.length === 0}
        onClick={this.generateDokumentpakke}
      />,
    ];

    const title = (
        <div>
            <h3> Dokumentpakke </h3>
            <h6> Her kan du lage en dokumentpakke med valgfrie tiltak fra innkumulerte saker og skyggesaker. Når du har huket av tiltakene du vil ha med og trykt “produser dokumentpakke», vil det lastes ned en PDF på din maskin med tiltakene i kronologisk synkende rekkefølge. </h6>
        </div>
    )

    const dialog = (
      <Dialog
        contentStyle={{width : '90%', maxWidth : "1900px"}}
        bodyStyle={{padding : "0px"}}
        autoScrollBodyContent={true}
        open={this.state.open}
        title={title}

        actions={actions}
      >
      <table className="table table-striped table-dokumentpakke">
        <thead>
        <tr>
          <th> Sakstype </th>
          <th> Avsluttet </th>
          <th> Sak </th>
          <th> Navn </th>
          <th> Kode </th>
          <th> Dato </th>
          <th> Forfall </th>
          <th> Valgt </th>
        </tr>
        </thead>
        {tilhorende_saker("Hovedsak", "hovedsak")}
        {tilhorende_saker("Innkumulert", "kumulert")}
        {tilhorende_saker("Skyggesak", "skyggesak")}
      </table>
      </Dialog>

    )

    return (
      <span>
        <RaisedButton 
          label="Dok. pakke"
          onClick={e => this.setState({open : !this.state.open})}
        />
        {dialog}
      </span>
    )
  }
}

export default connect()(Dokumentpakke);
