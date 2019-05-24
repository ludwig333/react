import React, { Component } from 'react';

import EikCard from './generics/EikCard';
import {List, ListItem} from 'material-ui/List';
import ChatDialog from './ChatDialog';

const MESSAGE_FROM_DEBTOR = 1;
const MESSAGE_FROM_SAKSBEHANDLER = 2;

class MessageThreads extends Component {

    render() {

        console.log(this.props.threads);

        if (this.props.threads.length === 0) return null;
        
        const debtorLastResponder = t => {
            const sorted = JSON.parse(JSON.stringify(t.Messages))
            .sort((a, b) => new Date(a.DTSent).getTime() - new Date(b.DTSent).getTime());

            return sorted[sorted.length - 1].BCT === MESSAGE_FROM_DEBTOR;
        }
        
        const debitorLastResponderText = t => debtorLastResponder(t) ? <span style={{color : "red"}}> Debitor venter svar. </span> : "";

        return (
            <EikCard
                title="Samtaler"
            > 
            <List>
                {this.props.threads.map(thread => {
                  return <ListItem 
                            primaryText={thread.Subject}
                            secondaryText={<div> {thread.Messages.length} meldinger. {debitorLastResponderText(thread)} </div>}
                            //innerDivStyle={debtorLastResponder(thread) ? {color : "red"} : {}}
                            onClick={(e) => this.props.openOnClick(thread.BID)}

                        />
                })}
            </List>
            {this.props.dialog !== null ? <ChatDialog postMsg={this.props.postMsg} close={() => this.props.closeOnClick(this.props.dialog.BID)} thread={this.props.dialog} /> : null}
            </EikCard>
        )
    }

}

export default MessageThreads;