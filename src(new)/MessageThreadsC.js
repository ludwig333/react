import React from 'react';

import { connect } from 'react-redux';
import MessageThreads from './MessageThreads';
import ChatDialog from './ChatDialog';

import {
    openCloseChatDialog,
    fetchThreads,
    fetchThreadsbynewchat
} from './modules/actions';

const saknr = () => {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

const dialog = (threads) => {
    const idx = threads.findIndex(a => a.dialogOpen);

    if (idx < 0) {
        return null;
    }
    return threads[idx]
}

const mapStateToProps = state => {
    return {
        threads : state.threads,
        dialog : dialog(state.threads),
        generellInfo : state.generellInfo,

    }
}


const postMsg = (msg, dispatch) => {
    return fetch(`/4daction/chatbox_post_message`, {
        method: 'POST',
        body : JSON.stringify(msg)
    })
    .then(res => {
        dispatch(fetchThreads(saknr()))
    });
}

const closeMsg = (msg, dispatch) => {
    return fetch(`/4daction/chatbox_close_message`, {
        method: 'POST',
        body : JSON.stringify(msg)
    })
    .then(res => {
        dispatch(fetchThreads(saknr()))
    });
}

const postChatHead = (msg, dispatch) => {
    return fetch(`/4daction/chatbox_post_newchat`, {
        method: 'POST',
        body : JSON.stringify(msg)
    })
    .then(res => {
        dispatch(fetchThreadsbynewchat(saknr()))
    });
}

const mapDispatchToProps = dispatch => {
    return {
        openOnClick: (id) => dispatch(openCloseChatDialog(id, true)),
        closeOnClick: (id) => dispatch(openCloseChatDialog(id, false)),
        postMsg: (msg) => postMsg(msg, dispatch),
        closeMsg: (msg) => closeMsg(msg, dispatch),
        postChatHead: (msg) => postChatHead(msg, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageThreads);