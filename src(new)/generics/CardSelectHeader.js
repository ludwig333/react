import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import './CardSelectHeader.css';

class CardSelectHeader extends Component {

    render() {

        const select = (buttonLabel) => {
            if (buttonLabel) {
                return ( 
                <SelectField
                    floatingLabelText="Legg til tiltak"

                >
                </SelectField>
                )
            }
            return null;
        }
        
        return (
            <div id="CardSelectHeader">
                    <div className="floatLeft">
                    <h1> {this.props.title} </h1>
                    </div>
                    <div className="floatRight">
                    {button(this.props.label)}
                    </div>
            </div>
        )
    }
}

export default CardSelectHeader;