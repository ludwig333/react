import React from 'react';
import { connect } from 'react-redux';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DebitorCreate from './DebitorCreate';
import Divider from 'material-ui/Divider';


import {
    snackbarMsg,
    fetchSkyggesaker
} from './modules/actions';

const initalState = {
    typeSamskyldnerValue : 7,
    queryString : "",
    queryNum : "",
    debtorNr : "",
    debtorNrValid : false,
    debitors : [],
    ingen_treff : false,
    selectedDebtor : "",
    window : 'PICK_SAMSKYLDNERTYPE'
}

class NySkyggesak extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, initalState);
    }

    queryDebitors = (e) => {
        e.preventDefault();
        const saksnr = this.props.saksnr;
        fetch(`/4daction/debitor_list?sak=${saksnr}`, {
            credentials : 'include', method : 'POST', body : JSON.stringify({filterName : this.state.queryString, filterNum : this.state.queryNum})
        }).then(res => res.json()).then(json => this.setState({debitors : json, debitorsFetched: true}))
    }


    createDebtorAndSkyggesak = (json) => {
        const saksnr = this.props.saksnr;

        json = JSON.stringify(json);

        fetch(`/4daction/debitor_create?sak=${saksnr}`, {
            credentials : 'include', method : 'POST', body : json })
        .then(res => res.json())
        .then(json => [json.length > 0, json])
        .then(bool => {
            if (bool[0]) {
                let debtorName = bool[1][0]['Navn'];
                this.props.dispatch(snackbarMsg(`Skyggesak opprettet på debitor ${debtorName}.`), false);
                this.props.dialogOpenClose('NY_SKYGGESAK');
                this.props.dispatch(fetchSkyggesaker(saksnr));
            } else {
                this.props.dispatch(snackbarMsg("Debitor kunne ikke opprettes."), true);
                this.props.dialogOpenClose('NY_SKYGGESAK');
            }
        })
    }

    render() {


        const textFieldStyle = {
            marginLeft : "10px"
        }

        const paperStyle = {
            display : "inline-block"
        }

        const actions = [
        <FlatButton
            label="Avbryt"
            onTouchTap={e => this.props.dialogOpenClose('NY_SKYGGESAK')}
        />
        ];

        const debitorList = () => {
            if (this.state.debitors.length === 0) return null;
            return (
                <table className="table table-striped table-sm">
                    <tr>
                        <th> Navn </th>
                        <th> Fnr/Orgnr </th>
                        <th> Opprett </th>
                    </tr>
                    {this.state.debitors.map(o => {
                        return (
                         <tr>
                             <td> {o.Navn} </td>
                             <td> {o.Fodsels_eller_orgnr} </td>
                             <td>
                                 <a href="#" onClick={e => this.createDebtorAndSkyggesak({existing_debtor: o.Eksternt_nr, Samskyldnertype: this.state.typeSamskyldnerValue})} >
                                 <b>Opprett skyggesak</b>
                                 </a>
                             </td>
                         </tr>
                        )
                    })}
                </table>
            )
        }

        return (
            <Dialog
                contentStyle={{width : "60%", maxWidth : 'none'}}
                autoScrollBodyContent={true}
                open={this.props.dialogOpen}
                title="Ny skyggesak"
                actions={actions}
            >
            <div className="row">
            <div className="col-md-6">
            <Subheader > Først, velg samskyldnertype: </Subheader>
                <SelectField
                    hintText="Samskyldertype"
                    value={this.state.typeSamskyldnerValue}
                    onChange={(e,i,v) => this.setState({typeSamskyldnerValue : v})}
                >
                    <MenuItem value={7} primaryText="Hjemmelshaver" />
                    <MenuItem value={5} primaryText="Arbeidsgiver" />
                    <MenuItem value={1} primaryText="Medskyldner" />
                </SelectField>
            <Subheader > Søk med navn </Subheader>
            <Paper style={paperStyle} zDepth={1}>
                <TextField
                    autoFocus
                    style={textFieldStyle} hintText="Navn på debitor"
                    underlineShow={false}
                    onChange={(e, str) => this.setState({queryString : str})} value={this.state.queryString}
                    />
                <FlatButton label="Finn" onTouchTap={this.queryDebitors} />
                <Divider />
            </Paper>
            <Subheader > Søk med debitornummer </Subheader>
            <Paper style={paperStyle} zDepth={1}>
                <TextField
                    style={textFieldStyle}
                    hintText="Reskontronummer"
                    underlineShow={false}
                    onChange={(e, str) => this.setState({queryNum : str})} value={this.state.queryNum}
                />
                <FlatButton label="Finn" onTouchTap={this.queryDebitors} />
                <Divider />
            </Paper>
            <Subheader > Eller opprett ny debitor </Subheader>
            <Paper style={paperStyle} zDepth={1}>
                <DebitorCreate isDebtorSelected={this.state.selectedDebtor.length > 0} createDebtor={this.createDebtorAndSkyggesak} samskyldnerType={this.state.typeSamskyldnerValue}/>
            </Paper>

            </div>
            <div className="col-md-6">
                {debitorList()}
            </div>
            </div>
            </Dialog>
        );
    }
}

export default connect()(NySkyggesak);
