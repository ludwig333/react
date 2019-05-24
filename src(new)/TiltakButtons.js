import React, { Component } from 'react';
import { connect } from 'react-redux';
import './generics/CardHeader.css';
import NyttTiltakQuick from './NyttTiltakQuick';

import {
    openCloseDialog
} from './modules/actions';

const tiltakQuick = [
    'IKV',
    'PUR',
    '418'
]

const style = {
    marginRight: "10px",
}

class TiltakButtons extends Component {

    constructor(props) {
        super(props);
        console.log("quickbuttons1",props.generellInfo);
console.log("quickbuttons",props.quickbuttons);
        this.closeDialog = this.closeDialog.bind(this);
    }

    closeDialog(msg) {
        this.props.dispatch(openCloseDialog(msg));
    }

    render() {
        console.log(this.props.digipost, "this.props.digipost")
        var kode_prosesstrinn = [];
        // let kode_prosesstrinn = this.props.digipost ? tiltakQuick.map(a => a + "_") : tiltakQuick;
        // kode_prosesstrinn = this.props.nynorsk ? kode_prosesstrinn.map(a => a + "+") : kode_prosesstrinn;
        
        if (Object.values(this.props.generellInfo.data).length > 0) {
            console.log("generellInfo..........", this.props.generellInfo);
            var json = this.props.quickbuttons;
                json = JSON.parse(json);
            
            kode_prosesstrinn = json ? Object.values(json) : tiltakQuick;
        }

        return (
            // <div style={{display : "inline-block", verticalAlign : "middle"}}>
            //         {kode_prosesstrinn.map(name => {
            //             if(name=="IKV" || name=="IKV_" || name=="IKV+"){
            //                 return <NyttTiltakQuick style={style} name={name} kode={this.props.TiltakQuick1} />
            //              }
            //              else if(name=="PUR" || name=="PUR_" || name=="PUR+"){
            //                 return <NyttTiltakQuick style={style} name={name} kode={this.props.TiltakQuick2} />
            //              }
            //              else if(name=="418" || name=="418_" || name=="418+"){
            //                 return <NyttTiltakQuick style={style} name={name} kode={this.props.TiltakQuick3} />
            //              }                         
                         
            //         })}
            // </div>

            <div style={{display : "inline-block", verticalAlign : "middle"}}>
                    {kode_prosesstrinn.map(name => {
                            return <NyttTiltakQuick style={style} name={name} kode={name} />            
                    })}
            </div>            
        )
    }
}

function mapStateToProps(state) {
    const { openCloseDialog, generellInfo } = state;
    // const { generellInfo } = state;
    const nynorsk = generellInfo.data.Nynorsk;
    const digipost = generellInfo.data.Bruker_digipost;
    const dialogOpen = openCloseDialog.nyttTiltakDialog;
    const TiltakQuick1 = generellInfo.data.TiltakQuick1;
    const TiltakQuick2 = generellInfo.data.TiltakQuick2;
    const TiltakQuick3 = generellInfo.data.TiltakQuick3;
    const quickbuttons = generellInfo.data.quickbuttons;        
    return {
        generellInfo,
        dialogOpen,
        nynorsk,
        digipost,
        TiltakQuick1,
        TiltakQuick2,
        TiltakQuick3,
        quickbuttons
    }
}

export default connect(mapStateToProps)(TiltakButtons);
