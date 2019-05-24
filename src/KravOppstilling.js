import React, { Component } from 'react';
import './KravOppstilling.css';
import RaisedButton from 'material-ui/RaisedButton';
import moment from 'moment';

import EikCard from './generics/EikCard';

class KravOppstilling extends Component {

    render() {

		// Converts a decimal number into an array of two strings.

		const numberStyle = {
			marginRight : "0px",
			paddingRight : "0px",
			paddingLeft : "0px",
			fontSize : "13px",
			fontWeight : "bolder"
		}

		const numToCols = (num) => {
			let arr = (num + "").split(".");
			arr[0] = arr[0] + "."
			if (arr.length === 1) {
				arr.push("00")
			}

      let obj = {}
      if (num < 0) obj.color = "red";
			return [
				<td style={{...obj, ...numberStyle, textAlign : "right"}}>{arr[0]}</td>,
				<td style={{...obj, ...numberStyle, textAlign : "left"}}>{arr[1]}</td>
			];
		}

        const info = this.props.oppstilling;

		if (info.Saldo === undefined) {
				return null;
		}

		const style = {
			fontSize : "12pt"
		}

		const tdStyle = {
			fontSize: "10pt",
			paddingLeft: "10px"
		}

    const actions = [
      <RaisedButton
        label="Utregning"
        onTouchTap={e => this.props.openClose('UTREGNING')}
      />
    ]
        return (
            <EikCard
              title="Oppstilling"
              subtitle={`Sak opprettet ${moment(this.props.info.Registrert).format("L")}`}
              actions={actions}
            >
				<table className="table table-striped table-sm oppstilling">
					<tbody className="oppstilling" style={style}>
						<tr>
							<td style={tdStyle}>Hovedstol</td>
							{numToCols(info.Hovedstol)}
						</tr>
						<tr>
							<td style={tdStyle}>Renter</td>
							{numToCols(info.Renter)}
						</tr>
						<tr>
							<td style={tdStyle}>Omkostninger</td>
							{numToCols(info.Omkostninger)}
						</tr>
						<tr>
							<td style={tdStyle}>Salær</td>
							{numToCols(info.Saler)}
						</tr>
						<tr>
							<td style={tdStyle}>- Innbetalt</td>
							{numToCols(info.Innbetalt)}
						</tr>
						<tr>
							<td style={tdStyle}>Saldo</td>
							{numToCols(info.Saldo)}
						</tr>
					</tbody>
				</table>
				<table  className="table table-striped table-sm oppstilling">
					<thead>
                        <tr>
                            <th> Kontonummer </th>
                            <th> KID </th>
                        </tr>
					</thead>
					<tbody>
						<tr>
                            <td style={{fontSize : "12px"}}> {info.Konto} </td>
                            <td style={{fontSize : "12px"}}> {info.KID} </td>
                        </tr>
					</tbody>
				</table>

			</EikCard>
        )
    }
}

export default KravOppstilling;
