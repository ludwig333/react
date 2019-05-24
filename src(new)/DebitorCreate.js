import React from 'react';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { connect } from 'react-redux';

import {
    snackbarMsg
} from "./modules/actions";

const initialState = {
    Etternavn : ["", "Etternavn"],
    Fornavn : ["", "Fornavn"],
    Postaddresse : ["", "Adresse"],
    Poststed : ["", "Postnummer"],
    COadresse : ["", "c/o"],
    Fodsels_eller_orgnr : ["", "Fødselsnummer eller orgnummer"]
}

class DebitorCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, initialState);
    }

    handleChange = (e, str, key) => {
        let arr = [...this.state[key]];
        arr[0] = str;
        this.setState({[key] : arr});
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.props.isDebtorSelected) {
            if (this.state.Etternavn[0].length === 0) {
                this.props.dispatch(snackbarMsg("Etternavn må fylles ut", true));
                return;
            }

            if (this.state.Poststed[0].length === 0) {
                this.props.dispatch(snackbarMsg("Postnummer må fylles ut", true));
                return;
            }
        }

        let obj_to_submit = Object.keys(this.state)
            .map(key => [key, this.state[key][0]])
            .reduce((prev, cur) => Object.assign(prev, {}, {[cur[0]] : cur[1]}), {})

        obj_to_submit["Samskyldnertype"] = this.props.samskyldnerType;

        this.props.createDebtor(obj_to_submit);
    }

    render() {

        const textFieldStyle = {
            marginLeft : "10px"
        }

        return (
            <div>
                {
                    Object.keys(this.state).map((key) => {
                        return (
                        <div>
                        <TextField
                            style={textFieldStyle}
                            hintText={this.state[key][1]}
                            value={this.state[key][0]}
                            underlineShow={false}
                            onChange={(e, str) => this.handleChange(e, str, key)}
                        />
                        <Divider />
                        </div>
                    )})
                }
                <FlatButton style={{float : "right"}} label="Opprett debitor og skyggesak" onTouchTap={this.handleSubmit} />
            </div>
        )
    }
}

export default connect()(DebitorCreate);
