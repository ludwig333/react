import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextFields from 'material-ui/TextField';
import "./ChatDialog.css"
import TextField from 'material-ui/TextField/TextField';

import moment from 'moment';

const MESSAGE_FROM_DEBTOR = 2;
const MESSAGE_FROM_SAKSBEHANDLER = 1;

class ChatDialog extends Component {

    state = {
        msg : ""
    }

    postMessage(BID) {
        const msg = Object.assign(this.state, {}, {threadBID : BID});
        console.log(msg);
        this.props.postMsg(msg).then(fin => this.setState({msg : ""}))
    }

    render() {

        const actions = [
            <FlatButton label="Svar" onClick={(e) => this.postMessage(this.props.thread.BID, this.props.postMsg)} />,
            <FlatButton label="Lukk" onClick={this.props.close}/>
        ]

        const messages = JSON.parse(JSON.stringify(this.props.thread.Messages))        
        .sort((a, b) => new Date(a.DTSent).getTime() - new Date(b.DTSent).getTime())
        .map(msg => 
            msg.BCT === MESSAGE_FROM_SAKSBEHANDLER ?
            <div className="left speechBubble"> <p className="chatMsg"> {msg.Message} </p> <span className="timeLeft"> {moment(msg.DTSent).format("LLL")} </span> </div> :
            <div className="right speechBubble"> <p className="chatMsg"> {msg.Message} </p> <span className="timeRight"> {this.props.thread.Saksbehandler_name + ", "} {moment(msg.DTSent).format("LLL")} </span> </div>
        );

        return(
            <div>
                <Dialog
                    title={this.props.thread.Subject}
                    modal={false}
                    actions={actions}
                    open={true}
                    autoScrollBodyContent={true}
                >
                <div>
                    {messages}
                </div>
                <TextField
                    value={this.state.msg}
                    hintText="Svar til skyldner"
                    floatingLabelText="Svar"
                    onChange={(e, str) => this.setState({msg : str})}
                    fullWidth={true}
                    multiLine={true}    
                />
                </Dialog>
          </div>
        )
    }
}

export default ChatDialog;