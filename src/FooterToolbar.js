import Subheader from 'material-ui/Subheader';
import React, { Component } from 'react';

import SettPaaVent from './SettPaaVent';
import AvsluttSak from './AvsluttSak';
import Avdragsavtale from './Avdragsavtale';
import NyInnbetaling from './NyInnbetaling';
import NySkyggesak from './NySkyggesak';
import NySamlesak from './NySamlesak';
import NyttTiltak from './NyttTiltak';
import NyttNotat from './NyttNotat';
import DebitorEdit from './DebitorEdit';
import DebtorSaker from './DebitorSaker'
import Ettergivelse from './Ettergivelse';
import Utregning from './Utregning';
import FordringCreate from './FordringCreate';
import NyttDebitornotat from './NyttDebitornotat';
import SaksValg from './SaksValg';
import Gjeldsordning from './Gjeldsordning';
import DialogSlett from './DialogSlett';

import {List, ListItem} from 'material-ui/List';

import './generics/CardHeader.css';

import { connect } from 'react-redux';

import {
    openCloseDialog,
    createPaaVent,
    avsluttSak,
    updateSak,
    createAvdragsavtale,
    createGjeldsordning,
    createInnbetaling,
    createFordring,
    fetchGenerellInfo,
    fetchOppstilling,
    fetchFordringer,
    fetchSak,
    deleteAvdragGjeldsordning,
    fetchInnbetalingerList,
    fetchTiltak,
    fetchNotater,
    snackbarMsg,
    samlesakpost,
} from './modules/actions';


const style = {
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "15px",
    color : "white",
    fontSize : "10pt"
}

const subeaderStyle = {
  color: "#cdd0d6",
  lineHeight: "30px",
  marginTop: "5px",
  paddingLeft: "0px"
}

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;}

class FooterToolbar extends Component {

    openClose = (name) => {
      if(name == "AVDRAGSAVTALE"){
      // var domain = window.location.hostname;  
      // var path = domain + "Avdragsavtale";
      var saksnr = this.props.saksnr;     
      window.location.href = "Avdragsavtale?sak="+saksnr;
      return;
    }
         this.props.dispatch(openCloseDialog(name));
    }
  


    settPaaVent = (jsonString) => {
        this.props.dispatch(snackbarMsg("Endrer status på sak...", true))
        this.props.dispatch(createPaaVent(this.props.saksnr, jsonString))
        .then(() => this.props.dispatch(snackbarMsg("Status på sak endret", true)))
    }

    hentGenerellInfo = (sak) => {
      this.props.dispatch(fetchGenerellInfo(sak));
    }

    saklistinfo = (sak) =>{
      this.props.dispatch(fetchSak(sak));
    }

    avsluttSak = (jsonString) => {
        let dispatch = this.props.dispatch;
        dispatch(snackbarMsg("Endrer status på sak...", true))
        dispatch(openCloseDialog('AVSLUTT_SAK'))
        .then(() => dispatch(avsluttSak(this.props.saksnr, jsonString)))
        .then(() => dispatch(fetchNotater(this.props.saksnr)))
        .then(() => this.props.dispatch(snackbarMsg("Status på sak endret", true)))
    }

    langtidSak = (jsonString) => {
        this.props.dispatch(updateSak(this.props.saksnr, jsonString))
        .then(() => this.props.dispatch(snackbarMsg("Status på sak endret", true)))
    }

    createAvdragsavtale = (jsonString) => {
        this.props.dispatch(createAvdragsavtale(this.props.saksnr, jsonString))
        .then(() => this.props.dispatch(fetchTiltak(this.props.saksnr)))
        .then(() => this.props.dispatch(fetchGenerellInfo(this.props.saksnr)))
        .then(() => this.props.dispatch(snackbarMsg("Avdragsavtale opprettet", true)))
    }

    createGjeldsordning = (jsonString) => {
      console.log(jsonString);
      this.props.dispatch(createGjeldsordning(this.props.saksnr, jsonString))
        .then(() => this.props.dispatch(fetchTiltak(this.props.saksnr)))
        .then(() => this.props.dispatch(fetchGenerellInfo(this.props.saksnr)))
        .then(() => this.props.dispatch(snackbarMsg("Gjeldsordning opprettet", true)))
    }

    samlesakpost = (jsonString) => {
      console.log("samlesakpost",jsonString);
      this.props.dispatch(samlesakpost(this.props.saksnr, jsonString))
    }    

    createFordring = (jsonString) => {
        this.props.dispatch(createFordring(this.props.saksnr, jsonString))
        .then(() => this.props.dispatch(snackbarMsg("Fordring opprettet", true)))
    }

    createInnbetaling = (jsonString) => {
        return this.props.dispatch(createInnbetaling(this.props.saksnr, jsonString))
            .then(json => {
                this.props.dispatch(fetchOppstilling(this.props.saksnr));
                this.props.dispatch(fetchGenerellInfo(this.props.saksnr));
                this.props.dispatch(snackbarMsg("Innbetaling/Ettergivelse registrert", true));
                return json;
            })
    }

    snackbarMsg = (msg, err) => {
        return this.props.dispatch(snackbarMsg(msg, err))
    }

    brukerurl(kommuneNr){
    if(kommuneNr > 2500 || kommuneNr == 2500){
     window.location.href ='http://hjelp.eikbedrift.no/';
    }
    else if(kommuneNr < 2500){
     window.location.href ='http://hjelp.eikkommune.no/';
    }
    }     

    render() {
        const kommuneNr = this.props.kommuneNr;
        console.log("VVVVV",kommuneNr);
        console.log("saklist",this.props.sakList);
        const div = (txt) => {
          return <div style={{color : "#bcd6ff", fontFamily: "monospace", top : "-8px"}}> {txt} </div>
        }

        if (this.props.debitor === undefined) return null;

        const avdragsavtale_gjeldsordning = (info) => {
          if (info.har_gjeldsordning) {
            return (
              <ListItem
                  innerDivStyle={style}
                  primaryText="Slett gjeldsordning"
                  onTouchTap={e => { this.props.dispatch(openCloseDialog("SLETT_GJELDSORDNING")) } }
                />
            )
          }

          if (info.har_avdragsavtale) {
            return (
              <ListItem
                  innerDivStyle={style}
                  primaryText="Slett avdragsavtale"
                  onTouchTap={e => { this.props.dispatch(openCloseDialog("SLETT_AVDRAGSAVTALE")) } }
                />
            )
          }

          return [
            <ListItem
                innerDivStyle={style}
                primaryText="Avdragsavtale"
                rightIcon={div("A")}
                onTouchTap={e => this.openClose('AVDRAGSAVTALE')}
             />,
             <ListItem
                 innerDivStyle={style}
                 primaryText="Gjeldsordning"
                 rightIcon={div("G")}
                 onTouchTap={e => this.openClose('GJELDSORDNING')}
            />
          ]

        }

        const listItemsOpprett = [
          ["Innbetaling", "I", "NY_INNBETALING"],
          ["Tiltak", "T", "NYTT_TILTAK"],
          ["Notat", "N", "NYTT_NOTAT"],
          ["Fordring", "F", "NY_FORDRING"],
          ["Debitornotat", "D", "DEBITOR_NOTAT"],
          ["Skyggesak", "U", "NY_SKYGGESAK"],
          ["Samlesak (Beta)", "", "NY_SAMLESAK"],
          ["Ettergivelse", "E", "ETTERGIVELSE"]
        ]


        return (
            <List>
                <Subheader style={subeaderStyle}> Sakstatus </Subheader>

                {
                this.props.avsluttet ? null :
                <div>
                <ListItem
                    innerDivStyle={style}
                    primaryText={this.props.paa_vent ? "Opphev på vent" : "Sett på vent"}
                    rightIcon={div("V")}
                    onTouchTap={e => this.openClose('PAA_VENT')}
                 />
                <ListItem
                    innerDivStyle={style}
                    primaryText={this.props.langtid ? "Opphev langtidsovervåking" : "Sett på langtidsovervåking"}
                    onTouchTap={e => this.langtidSak(JSON.stringify({langtid : !this.props.langtid}))}
                />
                <SettPaaVent MaxVent={this.props.MaxVent} msg={this.snackbarMsg} is_paa_vent={this.props.paa_vent} settPaaVent={this.settPaaVent} dialogOpenClose={this.openClose} dialogOpen={this.props.openCloseDialog.PAA_VENT} />
                </div>
                }

            {
            this.props.avsluttet ?
            <ListItem
                style={{textColor : "white"}}
                innerDivStyle={style}
                primaryText="Gjennoppta sak"
                rightIcon={div("Q")}
                onTouchTap={e => this.openClose('AVSLUTT_SAK')}
             />
            :
            <ListItem
                innerDivStyle={style}
                primaryText="Avslutt sak"
                rightIcon={div("Q")}
                onTouchTap={e => this.openClose('AVSLUTT_SAK')}
             />
            }

            {this.props.kumulert_til ?
            <ListItem
                innerDivStyle={style}
                primaryText="Opphev kumulasjon"
                onTouchTap={e => this.props.dispatch(updateSak(sak(), JSON.stringify({Opphev_kumulasjon : true})))
                    .then(() => {
                    this.props.dispatch(fetchOppstilling(sak()));
                    this.props.dispatch(fetchFordringer(sak()));
                    this.props.dispatch(fetchInnbetalingerList(sak()));
                    })}
             /> : null
            }
            {this.props.er_skyggesak === 2 ?
            <ListItem
                innerDivStyle={style}
                primaryText="Opphev skyggesak"
                onTouchTap={e => this.props.dispatch(updateSak(sak(), JSON.stringify({Skygger_sak : ""})))}
             /> : null
            }

                <Subheader style={subeaderStyle}> Opprett </Subheader>
                {
                  listItemsOpprett.map(item => {
                    return (
                      <ListItem
                        innerDivStyle={style}
                        primaryText={item[0]}
                        rightIcon={div(item[1])}
                        onTouchTap={e => this.openClose(item[2])}
                      />
                    )
                  })
                }

                {avdragsavtale_gjeldsordning(this.props.info)}

                <ListItem
                   innerDivStyle={style}
                   primaryText="Utleggstrekk"
                   onTouchTap={(e) => {
                     e.preventDefault();
                     window.open(`/Sak/Utleggstrekk?Sak=${sak()}&old=true`);
                   }}
                />

                <ListItem
                   innerDivStyle={style}
                   primaryText="Kumulasjon"
                   onTouchTap={e => {
                     window.location.href = '/Debitor?Debitor=' + this.props.debitor_nr
                   }}
                />

                <NyInnbetaling msg={this.snackbarMsg} createInnbetaling={this.createInnbetaling} dialogOpenClose={this.openClose} dialogOpen={this.props.openCloseDialog.NY_INNBETALING} />
                <NyttTiltak dialogOpen={this.props.openCloseDialog.NYTT_TILTAK} dialogOpenClose={this.openClose} />
                <NyttNotat dialogOpen={this.props.openCloseDialog.NYTT_NOTAT} dialogOpenClose={this.openClose} />
                <FordringCreate createFordring={this.createFordring} dialogOpen={this.props.openCloseDialog.NY_FORDRING} dialogOpenClose={this.openClose} />
                <NySkyggesak dialogOpen={this.props.openCloseDialog.NY_SKYGGESAK} dialogOpenClose={this.openClose} saksnr={this.props.saksnr} />
                <NySamlesak msg={this.snackbarMsg} samlesakpost={this.samlesakpost} dialogOpen={this.props.openCloseDialog.NY_SAMLESAK} dialogOpenClose={this.openClose} saklistinfo={this.props.sakList} saksnr={this.props.saksnr} />
                <Ettergivelse msg={this.snackbarMsg} createInnbetaling={this.createInnbetaling} dialogOpen={this.props.openCloseDialog.ETTERGIVELSE} dialogOpenClose={this.openClose} saksnr={this.props.saksnr} />

                <Subheader style={subeaderStyle}>Annet</Subheader>

                <AvsluttSak is_avsluttet={this.props.avsluttet} avsluttSak={this.avsluttSak} dialogOpenClose={this.openClose} dialogOpen={this.props.openCloseDialog.AVSLUTT_SAK} />
                <Avdragsavtale hentGenerellInfo={this.hentGenerellInfo} createAvdragsavtale={this.createAvdragsavtale} dialogOpenClose={this.openClose} dialogOpen={this.props.openCloseDialog.AVDRAGSAVTALE} />

                <DialogSlett
                  tittel="Slett avdragsavtale"
                  dialogOpen={this.props.openCloseDialog.SLETT_AVDRAGSAVTALE}
                  dialogName="SLETT_AVDRAGSAVTALE"
                  deleteAction={deleteAvdragGjeldsordning(sak())}
                />
                <Gjeldsordning createGjeldsordning={this.createGjeldsordning} dialogOpen={this.props.openCloseDialog.GJELDSORDNING} dialogOpenClose={this.openClose}/>
                <DialogSlett
                  tittel="Slett gjeldsordning"
                  dialogOpen={this.props.openCloseDialog.SLETT_GJELDSORDNING}
                  dialogName="SLETT_GJELDSORDNING"
                  deleteAction={deleteAvdragGjeldsordning(sak())}
                />

                 <DebitorEdit loading={this.props.debitor.loading} data={this.props.debitor.data} dialogOpen={this.props.openCloseDialog.ENDRE_DEBITOR} dialogOpenClose={this.openClose} />

                <Utregning />
                <DebtorSaker />
                <ListItem
                    innerDivStyle={style}
                    primaryText="Saksvalg"
                    rightIcon={div("S")}
                    onTouchTap={e => this.openClose('SAKSVALG')}
                 />
                <SaksValg />

                <NyttDebitornotat />
                <ListItem
                   innerDivStyle={style}
                   primaryText="Brukerhåndbok"
                   onTouchTap={e => this.brukerurl(kommuneNr)
                     }
                />
                

            </List>
        )
    }
}

function mapStateToProps(state) {
    const { openCloseDialog, generellInfo, debitor, skyggesaker, sakList } = state;

    if (generellInfo.loading) return {
        paa_vent : false,
        avsluttet : false,
        langtid : false,
        openCloseDialog
    };

    const saksnr = generellInfo.data.Nr;
    const langtid = generellInfo.data.langtid;
    const paa_vent = generellInfo.data.paa_vent === "True" ? true : false;
    const avsluttet = generellInfo.data.Avsluttet.includes("0000") ? false : true;
    const kumulert_til = generellInfo.data.Kumulert_til !== "";
    const er_skyggesak = generellInfo.data.Skygger_sak;
    const har_avdragsavtale = generellInfo.data.har_avdragsavtale;
    const har_gjeldsordning = generellInfo.data.har_gjeldsordning;
    const debitor_nr = generellInfo.data.debitor_nr;
    const info = generellInfo.data;
    const kommuneNr = generellInfo.data.kommuneNr;
    const MaxVent = generellInfo.data.MaxVent;

    return {
        openCloseDialog,
        sakList,
        saksnr,
        paa_vent,
        avsluttet,
        debitor,
        langtid,
        skyggesaker,
        er_skyggesak,
        kumulert_til,
        har_avdragsavtale,
        har_gjeldsordning,
        debitor_nr,
        info,
        kommuneNr,
        MaxVent
    }
}

export default connect(mapStateToProps)(FooterToolbar);
