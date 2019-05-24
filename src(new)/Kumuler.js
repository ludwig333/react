import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    fetchDebitorSaker
} from './modules/actions';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

function getURLParameter() {
        return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

class Kumuler extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sak : getURLParameter(),
            checked : [],
            sakerSelected : false,
            parentSak : "",
        }
    }

    componentWillMount() {
        this.props.dispatch(fetchDebitorSaker(this.state.sak))
    }

    kumulerSaker = () => {
        let data = new FormData();
        data.append()
    }

    render() {

        const eligibleForCumulation = (o) => {
            const kumulerteSaker = new Set(this.props.debitorSakerList.data
                .filter(o => o.Kumulert_til !== "").map(o => o.Kumulert_til))

            if (o.Kumulert_til !== "") {
                return "Kumulert inn i " + o.Kumulert_til;
            }

            if (o.Skygger_sak !== "") {
                return "Skygger sak " + o.Skygger_sak
            }

            if (kumulerteSaker.has(o.Nr)) {
                return "Forelder"
            }

            return (
                <input 
                type="checkbox" 
                value={this.state.checked[o.Nr]}
                onClick={
                    (e) => {
                        this.setState({checked : Object.assign({},this.state.checked,{[o.Nr] : e.target.value})})
                    }
                }/>
            )
        }

        const saker = this.props.debitorSakerList.data
        .slice()
        .reverse()
        .map(o => {
            return (
                <tr>
                    <td> {o.Nr} </td>
                    <td> {o.Saldo} </td>
                    {o.Avsluttet.includes('0000') ? 
                        <td style={{color : "green"}}> Aktiv </td>  :
                        <td style={{color : "red"}}> Avsluttet </td>}
                    <td> {eligibleForCumulation(o)} </td>
                </tr>
            )
        });

        const pickParent = () => {
            if (!this.state.sakerSelected) return null;
            return (
                <div>
                    <h1> Velg forelder </h1>
                    <SelectField
                        floatingLabeLText="Velg hovedsak"
                        value={this.state.parentSak}
                        onChange={(e,i,v) => this.setState({parentSak : v})}
                    >
                        {
                            Object.keys(this.state.checked).map(o => {
                                return (
                                    <MenuItem value={o} primaryText={o} />
                                )
                            })
                        }
                    </SelectField>
                    <button onClick={this.kumulerSaker}> Kumuler </button>
                </div>
            )
        }
        
        return(
            <div className="card debitor-info">
            <h1> Debitors saker </h1>
            <button onClick={e => this.setState({sakerSelected : true})}> Kumuler </button>
            {pickParent()}
            <table className="table table-striped table-sm">
            <thead>
            <tr>
                <td> Sak </td>
                <td> Saldo </td>
                <td>  </td>
                <td> Kumuler </td>
            </tr>
            </thead>
            <tbody>
                {saker}
            </tbody>
            </table>
            </div>
    
        )
    }
}

function mapStateToProps(state) {
    const { debitorSakerList } = state;
    return {
        debitorSakerList
    } 
}

export default connect(mapStateToProps)(Kumuler)