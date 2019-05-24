import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';

import DatePickerNorwegian from './generics/DatePickerNorwegian';
import moment from 'moment';
import { connect } from 'react-redux';
import InputValidation from './generics/InputValidation';

const OPTIONS = {};
class NySamlesak extends Component {
    constructor(props) {
        super(props);
        props.sakList.data.map(o => { OPTIONS[o.Sak] = o.Select});
        // this.state = {
        //   checkboxes: OPTIONS.reduce(
        //     (options, option) => ({
        //       ...options,
        //       [option]: false
        //     }),
        //     {}
        //   )
        // };

        this.state = {
          checkboxes: OPTIONS
        };  

        this.dialogOpenClose = this.dialogOpenClose.bind(this);
        console.log("OPTIONS",OPTIONS);
        console.log("checkboxes_yyy",this.state.checkboxes);
       
    }

    clearState() {
        this.setState({checkboxes: OPTIONS});
    }

    resetState() {
        this.props.sakList.data.map(o => { OPTIONS[o.Sak] = o.Select});
        console.log("aleksandr",this.props.sakList.data)
        this.setState({checkboxes: OPTIONS});
    }

    selectAllCheckboxes = isSelected => {

      Object.keys(this.state.checkboxes).forEach(checkbox => {
        // BONUS: Can you explain why we pass updater function to setState instead of an object?
        this.setState(prevState => ({
          checkboxes: {
            ...prevState.checkboxes,
            [checkbox]: isSelected
          }
        }));       
      });
      console.log("checkboxes_xxx",this.state.checkboxes);
    };

    selectAll = () => this.selectAllCheckboxes(true);

    deselectAll = () => this.selectAllCheckboxes(false);

    handleCheckboxChange = changeEvent => {

      const  name  = changeEvent.target.value;
      console.log("selectedoption",changeEvent.target.value);
      this.setState(prevState => ({
        checkboxes: {
          ...prevState.checkboxes,
          [name]: !prevState.checkboxes[name]
        }
      })
      );
console.log("checkboxes",this.state.checkboxes);
    };

    dialogOpenClose () {
        this.setState({
            dialogOpen : !this.state.dialogOpen
        })
    }


    render() {
    

        const actions = [
            <FlatButton
                label="Avbryt"
                onTouchTap={e => {
                  this.props.dialogOpenClose('NY_SAMLESAK');
                  this.clearState();
                }
              }
            />,
            <FlatButton
                label="Lagre"
                keyboardFocused={true}
                onTouchTap={e => {
                  this.props.samlesakpost(JSON.stringify(this.state.checkboxes)); 
                 
                }
              }
            />
        ];

    const errMsg = () => {
      return <div style={{ color: "red" }}>{this.state.err}</div>;
    };
        return (
            <div className="sett-paa-vent">
                 <Dialog
                    open={this.props.dialogOpen}
                    title="Samlesak"
                    actions={actions}
                    autoScrollBodyContent={true}
                 >
                
                <button
                  type="button"
                  className="btn btn-outline-primary mr-2"
                  onClick={this.selectAll}
                >
                  Velg alle
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary mr-2"
                  onClick={this.deselectAll}
                >
                  Fjern alle valg
                </button>

                <table className="table table-striped table-sm">
                    <tr>
                        <th> Velg </th>
                        <th> Sak Nr </th>
                        <th> Kreditor </th>
                        <th>Sak opprettet</th>
                        <th>Saldo</th>
                        <th>status</th>
                        <th>Siste tiltak</th>
                    </tr>
                    {this.props.saklistinfo.data.map(o => {
                        return (
                         <tr>
                             <td>
                    <Checkbox
                        label=""
                        checked={this.state.checkboxes[o.Sak]}
                        onCheck={this.handleCheckboxChange}
                        value={o.Sak}                      
                    />
                             </td>
                             <td> {o.Sak} </td>
                             <td> {o.Kreditor} </td>
                             <td>{o.Registrert}</td>
                             <td>{o.Saldo}</td>
                             <td>{o.Status}</td>
                             <td>{o.LastTiltak}</td>
                         </tr>
                        )
                    })}
                </table>
                {this.state.err === true ? errMsg : null}
                 </Dialog>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { sakList } = state;

    return {
        sakList,
    }
}

export default connect(mapStateToProps)(NySamlesak);
