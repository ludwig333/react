import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import './DebitorEdit.css';

import { connect } from 'react-redux';

import {
  updateDebitor,
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

const initialState = {
  debInfo : {},
  loading : true
}

class DebitorEdit extends Component {

    state = Object.assign({}, initialState);

    handleInput = (val, key) => {
        this.setState({
            debInfo : { ...this.state.debInfo, [key] : val }
        })
    }

    submitUpdate = () => {
      this.props.dispatch(updateDebitor(sak(), JSON.stringify(this.state.debInfo)));
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        debInfo : nextProps.debitorInfo.data,
        loading : nextProps.debitorInfo.loading
      })
    }

    render() {

        if (this.state.loading) return null;

        const exclude = [
            'Selvstendig_neringsdrivende',
            'Bo_eller_skiftestyre',
            'Gjennomgaende_notat',
            'Telefaks',
            'Xledger_Code',
            'Digipost_status',
            //'Postadresse_2',
            'Eksternt_nr',
            'Navn',
            'gatested_nr_navn',
            'poststed_nr_navn'
        ]

        const displayNames = [
            ["Fornavn", "Fornavn"],
            ["Etternavn", "Etternavn/Firma"],
            ["Postadresse", "Postadresse"],
            ["Poststed", "Postnummer"],
            ["Gateadresse", "Adresse (Eiendom)"],
            ["Gatested", "Postnummer (Eiendom)"],
            ["Land", "Land"],
            ["Fodsels_eller_orgnr", "Fødselsnummer/Orgnr"],
            ["Telefon", "Fasttelefon"],
            ["Mobil", "Mobiltelefon"],
            ["Kontaktperson", "Kontaktperson"],
            ["epost", "E-post"],
            ["Postadresse_2", "Adresse (c/o)"]
        ].reduce((acc, cur) => {
            acc[cur[0]] = cur[1];
            return acc;
          }, {});

        const actions = [
            <FlatButton
                label="Lukk"
                onTouchTap={(e) => this.props.dialogOpenClose('ENDRE_DEBITOR')}
            />,
            <FlatButton
                label="Lagre"
                onTouchTap={(e) => this.submitUpdate()}
            />,
        ];

        const debitorBooleanFields = Object.entries(this.props.debitorInfo.data)
        .map((a, idx) => {
            if (typeof a[1] === 'boolean') {
                return (
                    <Checkbox
                        label={a[0]}
                        checked={this.state.debInfo[a[0]]}
                        onCheck={(e, bool) => this.handleInput(bool, a[0])}
                    />
                )
            }
            return null;
        });

        const debitorTextFields = Object.entries(this.props.debitorInfo.data)
        .filter(a => !exclude.includes(a[0]))
        .map((a, idx) => {
            if (typeof a[1] === 'string') {
                return (
                    <TextField
                        onChange={(e) => {e.preventDefault(); this.handleInput(e.target.value, a[0])}}
                        defaultValue={this.state.debInfo[a[0]]}
                        floatingLabelText={displayNames[a[0]]}
                    />
                )
            }
            return null;
        });

        return (
            <Dialog
                title="Endre debitorinformasjon"
                autoScrollBodyContent={true}
                actions={actions}
                modal={false}
                open={this.props.dialogOpen}
            >
                <div>
                    {debitorTextFields}
                    <div className="boolean_fields">
                    {debitorBooleanFields}
                    </div>
                </div>
            </Dialog>
        )
    }
}

function mapStateToProps(state) {
  const debitorInfo = state.debitor;
  return {
    debitorInfo
  }
}

export default connect(mapStateToProps)(DebitorEdit);
