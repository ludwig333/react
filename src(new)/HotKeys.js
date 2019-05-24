import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    openCloseDialog
} from './modules/actions';

class HotKeys extends Component {

    constructor(props) {
        super(props);
        console.log('saksnrxxx',props.saksnr)
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.rootHandler = this.rootHandler.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyUp(e) {

        if (document.activeElement !== document.body) {
            return;
        }

        // Checks if any dialogs are open.
        // If they are, ignore hotkeys.
        let a = this.props.openCloseDialog;
        if (Object.keys(a).reduce((p,c) => a[c] || p , false)) {
            return;
        }

        let key = e.key;

        if (!(e.key === "Meta" || e.key === "Control")) {
            e.preventDefault();

            switch (this.props.focus) {
                case '' : {
                    this.rootHandler(key);
                    break;
                }
                case 'FORDRINGER' : {
                    break;
                }
                default : break;
            }
        }


    }

    rootHandler(key) {
        switch (key) {
            case "v" : this.props.dispatch(openCloseDialog('PAA_VENT')); break;
            case "q" : this.props.dispatch(openCloseDialog('AVSLUTT_SAK')); break;
            case "a" : window.location.href = "Avdragsavtale?sak="+this.props.saksnr; break;
            //case "a" : this.props.dispatch(openCloseDialog('AVDRAGSAVTALE')); break;
            case "g" : this.props.dispatch(openCloseDialog('GJELDSORDNING')); break;
            case "i" : this.props.dispatch(openCloseDialog('NY_INNBETALING')); break;
            case "t" : this.props.dispatch(openCloseDialog('NYTT_TILTAK')); break;
            case "n" : this.props.dispatch(openCloseDialog('NYTT_NOTAT')); break;
            case "y" : this.props.dispatch(openCloseDialog('ENDRE_DEBITOR')); break;
            case "u" : this.props.dispatch(openCloseDialog('NY_SKYGGESAK')); break;
            case "e" : this.props.dispatch(openCloseDialog('ETTERGIVELSE')); break;
            case "f" : this.props.dispatch(openCloseDialog('NY_FORDRING')); break;
            case "d" : this.props.dispatch(openCloseDialog('DEBITOR_NOTAT')); break;
            case "s" : this.props.dispatch(openCloseDialog('SAKSVALG')); break;
            default : break;
        }
    }

    render() {

        return(
            <div ref={refs => this.rootDiv = refs}>
                {this.props.children}
            </div>
        )
    }

}

function mapStateToProps(state) {
    const { focus, openCloseDialog } = state;
    return {
        focus,
        openCloseDialog
    }
}

export default connect(mapStateToProps)(HotKeys);
