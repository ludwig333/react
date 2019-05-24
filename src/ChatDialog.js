import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextFields from 'material-ui/TextField';
import "./ChatDialog.css"
import TextField from 'material-ui/TextField/TextField';

import moment from 'moment';

const MESSAGE_FROM_DEBTOR = 1;
const MESSAGE_FROM_SAKSBEHANDLER = 2;

class ChatDialog extends Component {

  // constructor(props) {
  //   super(props);
  //       console.log("chat dialog",props.thread.Messages);

  // }

    state = {
        msg : ""
    }

    postMessage(ID) {
        const msg = Object.assign(this.state, {}, {threadID : ID}, {ChatBCT : 2});
        console.log(msg);
        this.props.postMsg(msg).then(fin => this.setState({msg : ""}))
    }

    closeMessage(ID) {
        const msg = Object.assign(this.state, {}, {threadID : ID});
        console.log(msg);
        this.props.closeMsg(msg).then(fin => this.setState({msg : ""}))
    }    

    render() {
        console.log("thread date end",new Date(this.props.thread.DateEnd).getTime());
        const action = ([
            <FlatButton label="Lukk" onClick={this.props.close}/>
        ]);
        const actions = (isNaN(new Date(this.props.thread.DateEnd).getTime()) ? [
            <FlatButton label="Svar" onClick={(e) => this.postMessage(this.props.thread.ID, this.props.postMsg)} />,
            <FlatButton label="Avslutt" onClick={(e) => this.closeMessage(this.props.thread.ID, this.props.closeMsg)} />
        ] : [
            <FlatButton label="Svar" disabled onClick={(e) => this.postMessage(this.props.thread.ID, this.props.postMsg)} />,
            <FlatButton label="Avslutt" disabled onClick={(e) => this.closeMessage(this.props.thread.ID, this.props.closeMsg)} />
        ]);

        const messages = JSON.parse(JSON.stringify(this.props.thread.Messages))        
        .map(msg => 
            msg.ChatBCT === MESSAGE_FROM_SAKSBEHANDLER ?
            <div className="left speechBubble"> <p className="chatMsg"> {msg.TheChat} </p> <span className="timeLeft"> {this.props.thread.Saksbehandlere_Name + ", "} {moment(new Date(msg.ChatDate).getTime() + new Date(msg.ChatTime).getTime()).format('LLL')} </span> </div> :
            <div className="right speechBubble"> <p className="chatMsg"> {msg.TheChat} </p> <span className="timeRight"> {this.props.thread.Debitorer_Name + ", "} {moment(new Date(msg.ChatDate).getTime() + new Date(msg.ChatTime).getTime()).format('LLL')} </span> </div>
        );
        const contentStyle = {
         display: "flex"
         
        };
        const parentelementStyle = {
          position: "relative"
        };         
        const elementStyle = {
          bottom: 0,
         position: "absolute"
        };        
        return(
            <div>
                <Dialog
                    title={this.props.thread.ChatName}
                    modal={false}
                    actions={action}
                    open={true}
                    autoScrollBodyContent={true}
                >
                <div style={contentStyle}>
                <TextField
                    value={this.state.msg}
                    hintText="Svar til skyldner"
                    floatingLabelText="Svar"
                    onChange={(e, str) => this.setState({msg : str})}
                    fullWidth={true}
                    multiLine={true}    
                /> 
                
                {actions}
                
                </div>              
                <div>
                    {messages}
                </div>

                </Dialog>
          </div>
        )
    }
}

export default ChatDialog;