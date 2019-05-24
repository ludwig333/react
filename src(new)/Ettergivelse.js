import React from 'react';
import { connect } from 'react-redux';

import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';

import moment from 'moment';

const typer = [
    'Renter',
    'Salær',
    'Omkostninger',
    'Alt',
    'Uerholdelig'
]


class Ettergivelse extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            valgt : 'Salær',
            belop : "",
            kommentar : "",
            disabledText : false,
            disabledSelect : false
        }
    }

    handleSubmit = (e) => {

        e.preventDefault();

        const action = this.state.valgt;

        let innbetaling = {
            belop : 0,
            dato : new Date(moment.now()),
            ikke_bokfoeres : true,
            tekst : "Ettergitt salær",
            err : ""
        }

        switch (action) {
            case 'Salær' : {
                innbetaling.tekst = "Ettergitt salær";
                break;
            }
            case 'Omkostninger' : {
                innbetaling.tekst = "Ettergitt Omkostninger";
                break;
            }
            case 'Renter' : {
                innbetaling.tekst = "Ettergitt renter";
                break;
            }
            case 'Alt' : {
                innbetaling.tekst = "Ettergitt alt";
                break;
            }
            case 'Uerholdelig' : {
                innbetaling.tekst = "Uerholdelig";
                break;
            }
            default : {
                innbetaling.tekst = this.state.kommentar;
            }
        }

        innbetaling.tekst = innbetaling.tekst + ". " + this.state.kommentar
        innbetaling.belop = this.state.belop === "" ? 0 : parseFloat(this.state.belop);
        let json = JSON.stringify(innbetaling);
        this.props.dialogOpenClose("ETTERGIVELSE");
        this.props.msg("Ettergir beløp...")
        this.props.createInnbetaling(json)
    }

    handleSelectChange = (e, i, v) => {
        if (v !== null) this.setState({disabledText : true})
        if (v === null && this.state.disabledText === true) this.setState({disabledText : false});
        this.setState({valgt : v});
    }

    handleTextChange = (e, str, type) => {
        e.preventDefault();
        if (str !== "") this.setState({disabledSelect : true});
        if (str === "" && this.state.disabledSelect === true) this.setState({disabledSelect : false});
        if (type === "belop") {
            if (!isNaN(str.replace(",","."))) {
                this.setState({belop : str})
            }
            if (str === "") {
                this.setState({belop : ""})
            }
        }
        if (type === "kommentar") this.setState({kommentar : str});
    }

    render() {

        const styleFields = {
            marginLeft : "20px"
        }

        const valg = typer.map(a =>
            <MenuItem
                key={a}
                value={a}
                primaryText={a}
            />

        )

        const actions = [
            <FlatButton onTouchTap={e => this.props.dialogOpenClose("ETTERGIVELSE")} label="Avbryt" />,
            <FlatButton onTouchTap={e => this.handleSubmit(e)} label="Ettergi" />
        ]

        return (
            <Dialog
                contentStyle={{width : "30%", maxWidth : 'none'}}
                open={this.props.dialogOpen}
                title="Ettergivelse"
                actions={actions}
            >
                <div className="row">
                <Subheader> Velg en kategori du ønsker å ettergi </Subheader>
                <SelectField
                    style={styleFields}
                    hintText="Hva skal du ettergi?"
                    value={this.state.valgt}
                    onChange={this.handleSelectChange}
                >
                {valg}
                </SelectField>
                </div>
                <div className="row">
                <Subheader> Hvor stort beløp skal ettergis (0 = Alt) </Subheader>
                <TextField
                    hintText="Beløp"
                    style={styleFields}
                    value={this.state.belop}
                    onChange={(e, str) => this.handleTextChange(e, str, "belop")}
                />
                <TextField
                    hintText="Kommentar"
                    style={styleFields}
                    value={this.state.kommentar}
                    onChange={(e, str) => this.handleTextChange(e, str, "kommentar")}
                />
                </div>

            </Dialog>
        )
    }
}

function mapStateToProps(state) {
    const { oppstilling, generellInfo } = state;
    return {
        oppstilling,
        generellInfo
    }
}

export default connect(mapStateToProps)(Ettergivelse);
