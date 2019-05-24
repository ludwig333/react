import React from 'react';
import { connect } from 'react-redux';

import Snackbar from 'material-ui/Snackbar';

import {
    snackbarClose
} from '../modules/actions';

class SnackbarMsg extends React.Component {

    constructor(props) {
        super(props);

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(str) {
        if (str === "timeout") {
            this.props.dispatch(snackbarClose())
        }
    }


    render() {

        const {msg, open} = this.props;

        return(
            <Snackbar
                message={msg}
                open={open}
                autoHideDuration={5000}
                onRequestClose={this.handleClose}
            />
        )
    }
}

function mapStateToProps(state) {
    const { snackbar } = state;
    const { msg, err, open } = snackbar;
    return {
        msg,
        err,
        open
    }
}

export default connect(mapStateToProps)(SnackbarMsg);
