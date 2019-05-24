import React, { Component } from 'react';

import EikCard from './generics/EikCard';
import {List, ListItem} from 'material-ui/List';
import ChatDialog from './ChatDialog';
import RaisedButton from 'material-ui/RaisedButton';

const MESSAGE_FROM_DEBTOR = 1;
const MESSAGE_FROM_SAKSBEHANDLER = 2;

class MessageThreads extends Component {

    state = {
        chathead : ""
    }

    postChatHead(saknb,debitor_nr) {
        const chathead = Object.assign(this.state, {saknb : saknb}, {debitor_nr : debitor_nr});
        console.log(chathead);
        this.props.postChatHead(chathead).then(fin => this.setState({chathead : ""}))
    }
    render() {

        console.log(this.props.threads);
        console.log("chat dialogxxx",this.props.dialog);
        console.log("generellInfoxcxcxcxcx",this.props.generellInfo.data.Nr);

        if (this.props.threads.length === 0){
        return (
            <div>
            <RaisedButton label="NY CHAT" onClick={(e) => this.postChatHead(this.props.generellInfo.data.Nr,this.props.generellInfo.data.debitor_nr,this.props.postChatHead)} />           
            <EikCard
                title="CHAT BOKS"
            > 
            </EikCard>
            </div>
        )
         }
        else{
        return (
            <div>
            <RaisedButton label="NY CHAT" onClick={(e) => this.postChatHead(this.props.generellInfo.data.Nr,this.props.generellInfo.data.debitor_nr,this.props.postChatHead)} />           
            <EikCard
                title="CHAT BOKS"
            > 
            <List style={{maxHeight: 100, overflow: 'auto'}}>
                {this.props.threads.map(thread => {
                  return <ListItem 
                            primaryText={`${thread.Messages.length}   ${thread.ChatName}`}
                            onClick={(e) => this.props.openOnClick(thread.ID)}
                            
                        >
                        </ListItem>
                })}
            </List>
            {this.props.dialog != null ? <ChatDialog closeMsg={this.props.closeMsg} postMsg={this.props.postMsg} close={() => this.props.closeOnClick(this.props.dialog.ID)} thread={this.props.dialog} /> : null}
            </EikCard>
            </div>
        )
        }
    }

}
        // const debtorLastResponder = t => {
        //     const sorted = JSON.parse(JSON.stringify(t.Messages))
        //     .sort((a, b) => new Date(a.DTSent).getTime() - new Date(b.DTSent).getTime());

        //     return sorted[sorted.length - 1].BCT === MESSAGE_FROM_DEBTOR;
        // }
        
       // const debitorLastResponderText = t => debtorLastResponder(t) ? <span style={{color : "red"}}> Debitor venter svar. </span> : "";
export default MessageThreads;