import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import EikCard from './generics/EikCard';
import NySMS from './NySMS';
import RaisedButton from 'material-ui/RaisedButton';

import {
    fetchTekstmeldinger,
    openCloseDialog
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


class SMSlist extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            expanded : false
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchTekstmeldinger(sak()));
    }

    render() {
        const meldinger = this.props.meldinger;
        const debitorInfo = this.props.debitorInfo;
        const generellInfo = this.props.generellInfo;

        if (meldinger.loading || debitorInfo.loading || generellInfo.loading) return null;
        if (debitorInfo.data.Mobil.length < 8) return null;

        var tabell = [];

        if (meldinger.data.length > 0) {
          tabell = this.props.meldinger.data
              .slice()
              .reverse()
              .map(o => {
                  return (
                      <tr>
                          <td> {moment(o.Sendt_tidspunkt).format("DD.MM.YYYY - HH:mm")} </td>
                          <td> {o.Melding} </td>
                      </tr>
                  );
              });
        }


        const actions = [
          <RaisedButton
            label="Ny SMS"
            onTouchTap={() => this.props.dispatch(openCloseDialog('NY_SMS_DIALOG'))}
          />
        ]

        return (
            <EikCard
                actions={actions}
                onExpandChange={this.onExpandChange}
                title="SMS"
            >
            	<table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th> Sendt </th>
                            <th> Melding </th>
                        </tr>
                    </thead>
					<tbody>
                        {tabell}
                    </tbody>
                </table>
                <NySMS />
            </EikCard>
        )
    }
}

function mapStateToProps(state) {
    const meldinger = state.smsList;
    const debitorInfo = state.debitor;
    const generellInfo = state.generellInfo;
    return {
        meldinger,
        debitorInfo,
        generellInfo
    }
}

export default connect(mapStateToProps)(SMSlist);
