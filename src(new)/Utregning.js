import React from "react";
import { connect } from "react-redux";
import UtregningDisplay from "./UtregningDisplay";

import { fetchUtregning, openCloseDialog } from "./modules/actions";

function sak() {
  return (
    decodeURIComponent(
      (new RegExp("[?|&][s|S]ak=([^&;]+?)(&|#|;|$)").exec(
        decodeURIComponent(location.search)
      ) || [null, ""])[1].replace(/\+/g, "%20")
    ) || null
  );
}

class Utregning extends React.Component {
  componentDidMount() {
    this.props.dispatch(fetchUtregning(sak()));
  }

  openCloseDialog = () => {
    this.props.dispatch(openCloseDialog("UTREGNING"));
  };

  render() {
    if (this.props.loading) {
      return null;
    }

    return (
      <UtregningDisplay openClose={this.openCloseDialog} {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const { utregning, generellInfo, openCloseDialog } = state;
  const dialogOpen = openCloseDialog.UTREGNING;
  const saksnr = generellInfo.Nr;
  const data = utregning.data;
  const loading = utregning.loading;
  return {
    data,
    loading,
    saksnr,
    dialogOpen
  };
}

export default connect(mapStateToProps)(Utregning);
