import React, { Component } from 'react';
import { connect } from 'react-redux';
import './generics/CardHeader.css';

import NyttTiltak from './NyttTiltak';

import {
    openCloseDialog
} from './modules/actions';

class InnbetalingerButtons extends Component {

    constructor(props) {
        super(props);

        this.closeDialog = this.closeDialog.bind(this);
    }

    closeDialog(msg) {
        this.props.dispatch(openCloseDialog(msg));
    }

    render() {

        // Each dialog as a component
        const contents = [
            <NyttTiltak closeDialog={this.closeDialog} dialogOpen={this.props.dialogOpen} />
        ]

        return (
            <div id="cardheader">
                <div className="floatLeft">
                    <h1> Innbetalinger </h1>
                </div>
                <div className="floatRight">
                </div>
                {contents}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { openCloseDialog } = state;
    const dialogOpen = openCloseDialog.nyttTiltakDialog;
    return {
        dialogOpen
    }
}

export default connect(mapStateToProps)(InnbetalingerButtons);