import React, { Component } from 'react';
import { connect } from 'react-redux';

import './DebitorInfo.css';
import DebitorEdit from './DebitorEdit';
import SamskyldnerEdit from './SamskyldnerEdit';
import RaisedButton from 'material-ui/RaisedButton';
import EikCard from './generics/EikCard';
import MessageThreadsC from "./MessageThreadsC";
import MessageThreads from "./MessageThreads";
//import ChatBox from './ChatBox';

import {
    openCloseDialog
} from './modules/actions';

class DebitorInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            debitorDialogOpen : false
        }
        this.handleOpenClose = this.handleOpenClose.bind(this);
    }

    handleOpenClose(e, status) {
        e.preventDefault();
        switch (status) {
            case 'OPEN':
                this.setState({debitorDialogOpen : true});
                break;
            case 'CLOSE':
                this.setState({debitorDialogOpen : false});
                break;
            default:
                break;
        }
    }

    render() {

        const styleKeys = {
          paddingLeft: "10px",
          fontSize: "10pt"
        }

        const styleVals = {
          fontSize: "13px",
          fontWeight: "bolder"
        }

        const showFieldsAs = [
            ["Eksternt_nr", "Debitornr"],
            ["Fodsels_eller_orgnr", "Person/orgnr"],
            ["Navn", "Navn"],
            ["Postadresse", "Postadresse"],
            ["poststed_nr_navn", "Postnummer"],
            //["Gateadresse", "Adresse (Debitor)"],
            //["gatested_nr_navn", "Postnummer (Eiendom)"],
            ["Mobil", "Mobiltelefon"],
            ["epost", "E-post"],
            //["Digipost_status", "Digipost"]
        ]

        const debitorInfo = Object.entries(this.props.info)
        .filter(keyVal => showFieldsAs.map(a => a[0]).includes(keyVal[0]))
        //.filter(o => o[1] !== "")
        .map((keyVal, idx) => {
            return (
                <tr>
        			<td style={styleKeys}>{showFieldsAs[idx][1]}</td>
        			<td style={styleVals}>{this.props.info[showFieldsAs[idx][0]]}</td>
			    </tr>
            );
        })

        const actions = [
            <RaisedButton
                label="Saker"
                onTouchTap={() => this.props.dispatch(openCloseDialog('DEBITOR_SAKER'))}
            />,
            <RaisedButton
                label="Rediger debitor (Y)"
                onTouchTap={() => this.props.dispatch(openCloseDialog('ENDRE_DEBITOR'))}
            />,
            <SamskyldnerEdit />
        ]

        return (
            <EikCard
                title="Debitor"
                actions={actions}
            >
				<table className="table table-striped table-sm">
					<tbody>
                        {debitorInfo}
                    </tbody>
                </table>


                <DebitorEdit
                    debitorDialogOpen={this.state.debitorDialogOpen}
                    handleOpenClose={this.handleOpenClose}
                    info={this.props.info}
                />
                
                <MessageThreadsC />
            </EikCard>
        )
    }
}

export default connect()(DebitorInfo);
