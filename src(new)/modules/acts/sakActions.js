
import {
  fetchGenerellInfo
} from './modules/actions';


function updateSak(sak, json) {
    return dispatch => {
        return fetch(`/4daction/sak_update?sak=${sak}`,
        { credentials : 'include', method : 'POST', body: json })
        .then(response =>  dispatch(fetchGenerellInfo(sak)))
    }
}

// Lar current saksbehandler arve sak

export function arveSak(sak, saksbehandler) {
  const json = {Saksbehandler : saksbehandler}
  updateSak(sak, JSON.stringify(json));
}
