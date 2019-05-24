import { combineReducers } from 'redux';

function updateTiltak(state, action) {
    if (action.type === 'UPDATE_TILTAK') {
        return Object.assign({}, state, action.data);
    }
    return {};
}

function focus(state = "", action) {
    if (action.type === "UPDATE_FOCUS") {
        return action.data
    }
    return state;
}

// We assume that only one stepper is present to the user at each time
function stepper(state = 0, action) {
    switch (action.type) {
        case 'STEP_NEXT' : {
            return ++state
        }
        case 'RESET_STEPS' : {
            return 0
        }
        default:
            return state;
    }

}

function notatInput(state = {
    notat: "",
    date: "",
    forfall: "",
    file: "",
    paaminnelse : false
}, action) {
    switch(action.type) {
        case 'NOTAT_TEXT_UPDATE' : return Object.assign({}, state, {notat : action.data});
        case 'NOTAT_DATE_UPDATE' : return Object.assign({}, state, {date : action.data});
        case 'NOTAT_FORFALL_UPDATE': return Object.assign({}, state, {forfall : action.data});
        case 'NOTAT_FILE_PATH': return Object.assign({}, state, {file : action.data});
        case 'NOTAT_PAAMINNELSE': return Object.assign({}, state, {paaminnelse : action.data});
        default: return state;
    }
}

const dialogs = [
    'PAA_VENT',
    'AVSLUTT_SAK',
    'AVDRAGSAVTALE',
    'NYTT_TILTAK',
    'UPDATE_FORDRING',
    'NY_INNBETALING',
    'NYTT_NOTAT',
    'ENDRE_DEBITOR',
    'NY_SKYGGESAK',
    'NY_SAMLESAK',
    'UTREGNING',
    'ETTERGIVELSE',
    'NY_FORDRING',
    "DEBITOR_SAKER",
    "DEBITOR_NOTAT",
    "SAKSVALG",
    "GJELDSORDNING",
    "NY_SMS_DIALOG",
    "SLETT_AVDRAGSAVTALE",
    "SLETT_GJELDSORDNING",
    "ENDRE_SAMSKYLDNER",
    "CLOSEALL"
]

function openCloseDialog(state = dialogs.reduce((acc, cur, i) => {
    acc[cur] = false;
    return acc;
}, {}), action) {
    if (dialogs.indexOf(action.type) > -1) {
        if(action.type === 'CLOSEALL'){  
            var newState = dialogs.reduce((acc, cur, i) => {
                acc[cur] = false;
                return acc;
            }, {});
            return newState;
        }
        else{
           return Object.assign({}, state, {[action.type] : !state[action.type]})           
        }
    }
    return state;
}



function snackbar(state = {
    msg : "",
    err : false,
    open : false
}, action) {
    if (action.type === 'SNACKBAR_MSG') {
        return Object.assign({}, state, {msg : action.msg, err : action.err, open : true});
    }
    if (action.type === 'SNACKBAR_CLOSE') {
        return Object.assign({}, state, {msg : "", err : false, open : false});
    }
    return state;
}

function msg_threads(state = [], action) {
    if (action.type === 'THREAD_LIST_GET') {
        console.log("Threadsvlk",action.data);
        
        if (state.length === 0) {
            return action.data.map((obj, idx) => Object.assign(obj, {'dialogOpen' : false}));
        } else {
            return action.data.map((obj, idx) => Object.assign(obj, {'dialogOpen' : state[idx].dialogOpen}))
        }
    }
        
    if (action.type === 'THREAD_OPEN_CLOSE') {
        return state.map((obj) => obj.ID === action.id 
            ? Object.assign(obj, {}, {'dialogOpen' : action.open}) 
            : obj)
    }

    if (action.type === 'THREAD_LIST_GET_BY_NEWCHAT'){
        return action.data;
    }
    return state;
}

// function msg_threads(state = [], action) {
//     if (action.type === 'THREAD_LIST_GET') {
//         console.log("Threads",action.data);

//         if (state.length === 0) {
//             return action.data.map((obj, idx) => Object.assign(obj, {'dialogOpen' : false}));
//         } else {
//             return action.data.map((obj, idx) => Object.assign(obj, {'dialogOpen' : state[idx].dialogOpen}))
//         }
//     }
        
//     if (action.type === 'THREAD_OPEN_CLOSE') {
//         return state.map((obj) => obj.BID === action.id 
//             ? Object.assign(obj, {}, {'dialogOpen' : action.open}) 
//             : obj)
//     }
//     return state;
// }

// For standard async calls
function reducerCreator(name) {
    return function(state = {
        loading: true,
        data: []
    }, action) {
        switch (action.type) {
            case `BEGIN_REQUEST_${name}`:
                return Object.assign({}, state, {
                    loading: true
                })
            case `${name}_RECEIVED`:
                return Object.assign({}, state, {
                    loading: false,
                    data: action.data
                })
            default:
                return state;
        }
    }
}

const notater = reducerCreator('NOTATER');
const tiltak = reducerCreator('TILTAK');
const fordringer = reducerCreator('FORDRINGER');
const debitor = reducerCreator('DEBITOR');
const oppstilling = reducerCreator('OPPSTILLING');
const prosesstrinnList = reducerCreator('PROSESSTRINN_LIST');
const prosesstrinn = reducerCreator('PROSESSTRINN');
const innbetalingerList = reducerCreator('INNBETALINGER_LIST');
const generellInfo = reducerCreator('GENERELL_INFO');
const debitorSakerList = reducerCreator('DEBITOR_SAKER_LIST');
const skyggesaker = reducerCreator('SKYGGESAKER_GET');
const utregning = reducerCreator('UTREGNING_GET');
const saksganger = reducerCreator('SAKSGANGER_GET');
const debitorNotater = reducerCreator('DEBITORNOTATER_GET');
const kumulerteSaker = reducerCreator('KUMULERTE_GET');
const smsList = reducerCreator('SMS_LIST');
const sakList = reducerCreator('SAK');
const samlesakList = reducerCreator('SAMLESAK_LIST');

const rootReducer = combineReducers({
    fordringer,
    tiltak,
    notater,
    debitor,
    generellInfo,
    oppstilling,
    prosesstrinnList,
    prosesstrinn,
    innbetalingerList,
    updateTiltak,
    focus,
    openCloseDialog,
    stepper,
    notatInput,
    debitorSakerList,
    snackbar,
    skyggesaker,
    saksganger,
    utregning,
    debitorNotater,
    kumulerteSaker,
    smsList,
    threads : msg_threads,
    sakList,
    samlesakList
})

export default rootReducer;
