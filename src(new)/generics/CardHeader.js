import React, { Component } from 'react';
import './CardHeader.css';

class CardHeader extends Component {

    render() {

        return (
            <div id="cardheader">
                    <div className="floatLeft">
                    <h1> {this.props.title} </h1>
                    </div>
                    <div className="floatRight">
                        {this.props.children}
                    </div>
            </div>
        )
    }
}

export default CardHeader;