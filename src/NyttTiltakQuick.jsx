import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import moment from 'moment';
import { connect } from 'react-redux';

import {
    createTiltak,
    fetchProsesstrinn
} from './modules/actions.js'

const data = {
    Forfall : moment(moment.now()).add(14, 'days').toISOString()
}

class NyttTiltakQuick extends React.Component {
    constructor(props) {
        super(props);

        this.createTiltak = this.createTiltak.bind(this);
    }

    sak() {
        return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;    }

    createTiltak(e) {
        e.preventDefault();

        this.props.dispatch(fetchProsesstrinn({prosesstrinn : this.props.kode, sak : this.sak()})).then((json) => {
            let tiltakToCreate = {};
            json[1].forEach(key => {
                tiltakToCreate[key] = data[key] === undefined ? "" : data[key];
            });
            tiltakToCreate["Dato"] = moment(moment.now()).toISOString();



            this.props.dispatch(createTiltak(this.sak(), JSON.stringify(tiltakToCreate), this.props.kode));
        });
    }
    render() {
        return (
            <RaisedButton {...this.props} label={this.props.name} onTouchTap={this.createTiltak}/>
        )
    }
}

export default connect()(NyttTiltakQuick);
