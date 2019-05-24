import React, { Component } from "react";
import "./App.css";

import TiltaksListe from "./TiltaksListe";
import DebitorInfo from "./DebitorInfo";
import KravOppstilling from "./KravOppstilling";
import FordringsListe from "./FordringsListe";
import Innbetalinger from "./Innbetalinger";
import AvdragListe from "./AvdragListe";
import NotaterListe from "./NotaterListe";
import HotKeys from "./HotKeys";
import SnackbarMsg from "./generics/SnackbarMsg";
import SkyggesakerListe from "./SkyggesakerListe";
import DebitorNotat from "./DebitorNotat";
import DebitorSakerKort from "./DebitorSakerKort";
import SamlesakList from "./SamlesakList";
import KumulerteListe from "./KumulerteListe";
import TopBar from "./TopBar";
import SMSlist from "./SMSlist";
import ChatDialog from "./ChatDialog";
import MessageThreadsC from "./MessageThreadsC";
import MessageThreads from "./MessageThreads";
import Sidebar from "./Sidebar";

import { connect } from "react-redux";

import CircularProgress from "material-ui/CircularProgress";

import {
  fetchTiltak,
  fetchFordringer,
  fetchNotater,
  fetchDebitor,
  fetchOppstilling,
  fetchProsesstrinnList,
  fetchInnbetalingerList,
  fetchGenerellInfo,
  fetchSkyggesaker,
  fetchKumulerte,
  fetchThreads,
  deleteTiltak,
  snackbarMsg,
  openCloseDialog,
  fetchSak
} from "./modules/actions";

class App extends Component {
  constructor(props) {
    super(props);
        console.log("generalinfo vvv");
        console.log(props.generellInfo);
        console.log("MessageThreads",props.threads);
        console.log("saklistxxx",props.sakList);
    this.state = { gotCredentials: false };
    this.deleteTiltak = this.deleteTiltak.bind(this);
    this.url = this.getURLParameter("sak");
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  deleteTiltak(tiltak) {
    this.props.dispatch(snackbarMsg("Sletter tiltak...", true));
    this.props
      .dispatch(deleteTiltak(this.url, tiltak))
      .then(() => this.props.dispatch(snackbarMsg("Tiltak slettet", true)));
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;
    dispatch(fetchSak(this.url));
    dispatch(fetchGenerellInfo(this.url));
    dispatch(fetchOppstilling(this.url));
    dispatch(fetchTiltak(this.url));
    dispatch(fetchFordringer(this.url));
    dispatch(fetchNotater(this.url));
    dispatch(fetchDebitor(this.url));
    dispatch(fetchInnbetalingerList(this.url));
    dispatch(fetchSkyggesaker(this.url));
    dispatch(fetchKumulerte(this.url));
    dispatch(fetchProsesstrinnList(this.url));
    dispatch(fetchThreads(this.url))
    document.addEventListener('keyup', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress);
  }

  handleKeyPress(event) {
    if (event.keyCode === 27) {
    this.props.dispatch(openCloseDialog("CLOSEALL"));
    }
    // else if (event.keyCode === 65) {
    //   var saksnr = this.props.generellInfo.data.Nr;     
    //   window.location.href = "Avdragsavtale?sak="+saksnr;
    //   return;
    // }    
  }


  getURLParameter(name) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
          decodeURIComponent(location.search)
        ) || [null, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  }

  fetchTiltaksListe = () => {
    this.props.dispatch(fetchTiltak(this.url));
  };

  render() {
    const {
      tiltak,
      fordringer,
      notater,
      debitor,
      oppstilling,
      prosesstrinnList,
      generellInfo,
      skyggesaker,
      kumulerteSaker,
      threads
    } = this.props;

    const sideBarStyle = {
      top: 0,
      position: "fixed",
      width: "250px",
      height: "100%",
      //backgroundColor: "#3d6099"
      // Orange color to make it very clear you are on test
       backgroundColor: generellInfo.data.backgroundColor
    };

    const contentStyle = {
      marginLeft: "250px",
      marginRight: "0px",
      marginTop: "80px",
      width: "auto",
      zIndex:"1"
    };

    const topbarStyle = {
      marginLeft: "250px",
      marginRight: "0px",
      paddingTop: "10px",
      paddingBottom: "10px",
      width: "auto",
      zIndex:"2",
      position: "fixed",
      width: "85%",
      backgroundColor: generellInfo.data.backgroundColor
    };    

    const appStyle = {
      overflowY: "scroll",
      height: "100%"
    };

    const nav = document.getElementsByClassName("topbar");
    const navTop = nav.offsetTop;

    function handleScroll() {
      if (window.scrollY > navTop) {
        nav.classList.add('fixed-nav');
        document.body.style.paddingTop = nav.offsetHeight+'px';
      } else {
        nav.classList.remove('fixed-nav');
        document.body.style.paddingTop = 0;
      }
    }

    window.addEventListener('scroll', handleScroll);

    return (
      <HotKeys saksnr = {generellInfo.data.Nr}>
        <SnackbarMsg />
        <div className="app" style={appStyle}>
          <div style={sideBarStyle} className="sidebar">
            <Sidebar info={generellInfo} />
          </div>
          <div style={topbarStyle} className="row topbar" id="topbar">
            <div className="col-md-12" style={{ textAlign: "center" }}>
              <TopBar info={generellInfo} />
            </div>
          </div>
          <div style={contentStyle} className="row">
            <div className="col-md-4">
              <KravOppstilling
                openClose={a => this.props.dispatch(openCloseDialog(a))}
                oppstilling={oppstilling.data}
                info={generellInfo.data}
              />
              <DebitorInfo info={debitor.data} />
              {
               generellInfo.data["Skygger_sak"] === 7 ? (<SamlesakList/>) : null
              }
              <SMSlist />
              <DebitorNotat debitor={debitor} />
              <DebitorSakerKort />
              {skyggesaker.loading ? null : (
                <SkyggesakerListe data={skyggesaker.data} />
              )}
              {kumulerteSaker.loading ? null : (
                <KumulerteListe data={kumulerteSaker.data} />
              )}
            </div>
            <div className="col-md-8">
              {tiltak.loading ? (
                <CircularProgress size={80} thickness={5} />
              ) : (
                <TiltaksListe
                  genInfo={generellInfo}
                  fetchTiltak={this.fetchTiltaksListe}
                  tiltak={tiltak.data}
                  deleteTiltak={this.deleteTiltak}
                  trinn={prosesstrinnList.data}
                />
              )}
              {/* <MessageThreadsC />*/}
              {notater.loading ? null : <NotaterListe notater={notater.data} />}
              <Innbetalinger innbetalinger={this.props.innbetalingerList} />
              {generellInfo.data.har_avdragsavtale ||
              generellInfo.data.har_gjeldsordning ? (
                <AvdragListe
                  genInfo={generellInfo.data}
                  avdrag={this.props.innbetalingerList}
                />
              ) : null}
              <FordringsListe fordringer={fordringer.data} />
            </div>
          </div>
        </div>
      </HotKeys>
    );
  }
}

function mapStateToProps(state) {
  const {
    tiltak,
    fordringer,
    notater,
    debitor,
    oppstilling,
    prosesstrinnList,
    innbetalingerList,
    generellInfo,
    skyggesaker,
    kumulerteSaker,
    threads,
    sakList

  } = state;
  return {
    tiltak,
    fordringer,
    notater,
    debitor,
    oppstilling,
    prosesstrinnList,
    innbetalingerList,
    skyggesaker,
    generellInfo,
    kumulerteSaker,
    threads,
    sakList

  };
}

export default connect(mapStateToProps)(App);
