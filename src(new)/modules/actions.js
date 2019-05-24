const rootURI = '/'

// For standard async operations involving list, the following abstraction accepts some arguments, and returns a new action creator.

function metaActionCreator(path, name) {
    return function (sak) {
        return dispatch =>
            new Promise((resolve, reject) => {
                dispatch({ type: `BEGIN_REQUEST_${name}` });
                return fetch(`${rootURI}${path}${sak}`,
                    { credentials: 'include' })
                    .catch(err => reject("ERR"))
                    .then(response => response.json())
                    .then(json => { dispatch({ type: `${name}_RECEIVED`, data: json }); return resolve(json) })
            })
    }
}

// A generalized version of the above function.
// basepatch is the URL, obj should be an object of key value pairs.
// param name is for the Redux-reducer.
function actionCreator(basepath, name) {
    return function (obj) {
        return dispatch =>
            new Promise((resolve, reject) => {
                dispatch({ type: `BEGIN_REQUEST_${name}` });
                let params = Object.keys(obj).reduce((prev, key) => {
                    return `${prev}${key}=${obj[key]}&`
                }, '?')
                return fetch(`${rootURI}${basepath}${params}`, {
                    credentials: 'include'
                })
                    .catch(err => reject("ERR"))
                    .then(res => res.json())
                    .then(json => { dispatch({ type: `${name}_RECEIVED`, data: json }); return resolve(json) })
            })
    }
}


// Fetching
export const fetchSak = metaActionCreator(
    'samlesak?sak=',
    'SAK'
);

export const fetchSakList = metaActionCreator(
    '4daction/Samlesak_List?sak=',
    'SAMLESAK_LIST'
);

export const fetchTiltak = metaActionCreator(
    '4daction/tiltak_list?sak=',
    'TILTAK'
);

export const fetchFordringer = metaActionCreator(
    '4daction/Fordring_list?sak=',
    'FORDRINGER'
)

export const fetchNotater = metaActionCreator(
    '4daction/notat_list?sak=',
    'NOTATER'
)

export const fetchDebitor = metaActionCreator(
    '4daction/json_debitor?sak=',
    'DEBITOR'
)

export const fetchOppstilling = metaActionCreator(
    '4daction/oppstilling_get?sak=',
    'OPPSTILLING'
)

export const fetchProsesstrinn = actionCreator(
    '4daction/prosesstrinn_get',
    'PROSESSTRINN'
)

export const fetchProsesstrinnList = metaActionCreator(
    '4daction/prosesstrinn_list?sak=',
    'PROSESSTRINN_LIST'
)

export const fetchInnbetalingerList = metaActionCreator(
    '4daction/innbetaling_list?sak=',
    'INNBETALINGER_LIST'
)

export const fetchGenerellInfo = metaActionCreator(
    '4daction/generell_info_get?sak=',
    'GENERELL_INFO'
)

export const fetchDebitorSaker = metaActionCreator(
    '4daction/debitor_saker_get?sak=',
    'DEBITOR_SAKER_LIST'
)

export const fetchSkyggesaker = metaActionCreator(
    '4daction/skyggesaker_get?sak=',
    'SKYGGESAKER_GET'
)

export const fetchKumulerte = metaActionCreator(
    '4daction/kumulerte_saker_get?sak=',
    'KUMULERTE_GET'
)

export const fetchUtregning = metaActionCreator(
    '4daction/utregning_get?sak=',
    'UTREGNING_GET'
)

export const fetchSaksganger = metaActionCreator(
    '4daction/saksganger_get?sak=',
    'SAKSGANGER_GET'
)

export const fetchDebitornotater = metaActionCreator(
    '4daction/debitornotat_list?sak=',
    'DEBITORNOTATER_GET'
)

export const fetchTekstmeldinger = metaActionCreator(
    '4daction/SMS_list?sak=',
    'SMS_LIST'
)

//

// export function fetchThreads(sak) {
//     return dispatch => {
//         return fetch(`/4daction/skyldnerportal_get_threads?nr=${sak}&pass=heisann`)
//             .then(res => res.json())
//             .then(json => {
//                 dispatch({
//                     type: 'THREAD_LIST_GET',
//                     data: json
//                 });
//             })
//     }
// }
export function fetchThreads(sak) {
    return dispatch => {
        return fetch(`/4daction/Chat_get_threads?nr=${sak}`)
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: 'THREAD_LIST_GET',
                    data: json
                });
            })
    }
}

export function fetchThreadsbynewchat(sak) {
    return dispatch => {
        return fetch(`/4daction/Chat_get_threads?nr=${sak}`)
            .then(res => res.json())
            .then(json => {
                dispatch({
                    type: 'THREAD_LIST_GET_BY_NEWCHAT',
                    data: json
                });
            })
    }
}
// Fetch everything



// Deletion

export function deleteTiltak(sak, tiltak) {
    return dispatch => {
        return fetch(`${rootURI}4daction/tiltak_delete?sak=${sak}&tiltak=${tiltak}`,
            { credentials: 'include' })
            .then(response => {
                dispatch(fetchTiltak(sak));
                dispatch(fetchOppstilling(sak));
                dispatch(fetchNotater(sak));
            })
    }
}

export function deleteDebitornotat(id, sak) {
    return dispatch => {
        return fetch(`${rootURI}4daction/debitornotat_delete?sak=${sak}&id=${id}`,
            { credentials: 'include' })
            .then(response => {
                dispatch(fetchDebitornotater(sak));
                dispatch(fetchDebitor(sak));
            })
    }
}

export function deleteAvdragGjeldsordning(sak) {
    return dispatch => {
        return fetch(`/4daction/avdragsavtale_delete?sak=${sak}`, {
            credentials: 'include'
        }).then(res => {
            dispatch(fetchGenerellInfo(sak));
            dispatch(fetchInnbetalingerList(sak));
            dispatch(fetchNotater(sak));
        })
    }
}

// Updates

export function avsluttSak(sak, jsonString) {
    return dispatch => {
        return fetch(`${rootURI}4daction/sak_avslutt?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                return dispatch(fetchGenerellInfo(sak));
            });
    }
}

export function updateTiltak(str, keyName) {
    return {
        type: 'UPDATE_TILTAK',
        data: { [keyName]: str }
    }
}

export function updateSak(sak, json) {
    return dispatch => {
        return fetch(`${rootURI}4daction/sak_update?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: json })
            .then(response => {
                dispatch(fetchGenerellInfo(sak))
                dispatch(fetchNotater(sak))
            }
            )
    }
}

export function updateSamskyldner(sak, json) {
    return dispatch => {
        return fetch(`${rootURI}4daction/API_samskyldner_update?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: json })
            .then(response => {
                dispatch(fetchGenerellInfo(sak))
                dispatch(fetchOppstilling(sak))
                dispatch(snackbarMsg('Samskyldner endret', true))
            }
            )
    }
}

export function opprettDebitornotat(sak, json) {
    return dispatch => {
        dispatch(openCloseDialog('DEBITOR_NOTAT'));
        dispatch(snackbarMsg('Oppretter debitornotat...', true))
        return fetch(`${rootURI}4daction/debitornotat_create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: json })
            .then(response => {
                dispatch(fetchDebitornotater(sak));
                dispatch(snackbarMsg('Opprettet debitornotat', true))
            })
    }
}

export function opprettSMS(sak, json) {
    return dispatch => {
        dispatch(openCloseDialog('NY_SMS_DIALOG'));
        dispatch(snackbarMsg('Sender SMS...', true))
        return fetch(`${rootURI}4daction/SMS_Create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: json })
            .then(response => {
                dispatch(fetchTekstmeldinger(sak));
                dispatch(snackbarMsg('SMS sendt!', true))
            })
    }
}

export function createTiltak(sak, tiltak, prosesstrinn) {
    return dispatch => {
        return fetch(`${rootURI}4daction/tiltak_create?sak=${sak}&prosesstrinn=${prosesstrinn}`,
            { credentials: 'include', method: 'POST', body: tiltak })
            .then(response => {
                dispatch(fetchTiltak(sak))
                dispatch(fetchOppstilling(sak))
            })
    }
}

export function createInnbetaling(sak, json) {
    return dispatch => {
        return fetch(`${rootURI}4daction/innbetaling_create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: json })
            .then(response => dispatch(fetchInnbetalingerList(sak)))
    }
}

export function createPaaVent(sak, jsonString) {
    return dispatch => {
        dispatch(openCloseDialog('PAA_VENT'));
        dispatch(snackbarMsg('Oppdaterer sak...', true))
        return fetch(`${rootURI}4daction/paa_vent?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                dispatch(fetchNotater(sak)).then(a => dispatch(fetchGenerellInfo(sak)));
            });
    }
}

export function createAvdragsavtale(sak, jsonString) {
    return dispatch => {
        dispatch(openCloseDialog('AVDRAGSAVTALE'));
        dispatch(snackbarMsg('Oppretter avdragsavtale...', true))
        return fetch(`${rootURI}4daction/avdragsavtale_create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                dispatch(fetchInnbetalingerList(sak));
                dispatch(fetchNotater(sak));
            });
    }
}

export function createGjeldsordning(sak, jsonString) {
    return dispatch => {
        dispatch(openCloseDialog('GJELDSORDNING'));
        dispatch(snackbarMsg('Oppretter gjeldsordning...', true))
        return fetch(`${rootURI}4daction/gjeldsordning_create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                dispatch(fetchInnbetalingerList(sak));
            });

    }
}

export function samlesakpost(sak, jsonString) {
    return dispatch => {
        // dispatch(openCloseDialog('NY_SAMLESAK'));
        return fetch(`${rootURI}4daction/Web_SamlesakUpdate?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {                                
                return response.json();
            })
            .then(data=>{
             console.log("samlesak response2",data.Message);  
             if(data.OK == "True"){
             dispatch(openCloseDialog('NY_SAMLESAK'));  
             fetchSak(sak);
             }
             else{
              dispatch(snackbarMsg(data.Message, true))  
             }  
            });
    }
}

export function createFordring(sak, jsonString) {
    return dispatch => {
        dispatch(openCloseDialog('NY_FORDRING'));
        dispatch(snackbarMsg('Oppretter fordring...', true))
        return fetch(`${rootURI}4daction/fordring_create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                dispatch(fetchFordringer(sak));
                dispatch(fetchOppstilling(sak))
            });
    }
}

export function createDebitor(sak, jsonString) {
    return dispatch => {
        return fetch(`${rootURI}4daction/debitor_create?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                dispatch(fetchInnbetalingerList(sak));
                dispatch(openCloseDialog('AVDRAGSAVTALE'));
            });
    }
}

// Updates

export function updateDebitor(sak, jsonString) {
    return dispatch => {
        dispatch(openCloseDialog("ENDRE_DEBITOR"));
        dispatch(snackbarMsg("Oppdaterer debitor..."))
        return fetch(`${rootURI}4daction/debitor_update?sak=${sak}`,
            { credentials: 'include', method: 'POST', body: jsonString })
            .then(response => {
                dispatch(fetchDebitor(sak));
                dispatch(snackbarMsg("Debitor oppdatert"))
            });
    }
}


export function updateNotatText(text) {
    return {
        type: 'NOTAT_TEXT_UPDATE',
        data: text
    }
}

export function updateNotatDate(date) {
    return {
        type: 'NOTAT_DATE_UPDATE',
        data: date
    }
}

export function updateNotatForfall(date) {
    return {
        type: 'NOTAT_FORFALL_UPDATE',
        data: date
    }
}

export function updateNotatFilepath(filepath) {
    return {
        type: 'NOTAT_FILE_PATH',
        data: filepath
    }
}

export function updateNotatPaaminnelse(bool) {
    return {
        type: 'NOTAT_PAAMINNELSE',
        data: bool
    }
}

// Hotkeys

export function updateFocus(whichComponent) {
    return {
        type: 'UPDATE_FOCUS',
        data: whichComponent
    }
}

// Dialogs

export function openCloseChatDialog(threadId, shouldOpen) {
    return {
        type: 'THREAD_OPEN_CLOSE',
        id: threadId,
        open: shouldOpen
    }
}

export function openCloseDialog(whichDialog = "") {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: whichDialog });
            return resolve("ok");
        })
    }
}

export function snackbarMsg(msg = "", err = false) {
    return {
        type: "SNACKBAR_MSG",
        msg,
        err
    }
}

export function snackbarClose() {
    return {
        type: "SNACKBAR_CLOSE"
    }
}

// Stepper state

export function stepNext() {
    return {
        type: 'STEP_NEXT'
    }
}

export function resetSteps() {
    return {
        type: 'RESET_STEPS',
    }
}
