import React, {Component} from 'react';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import DatePickerNorwegian from './generics/DatePickerNorwegian';
import moment from 'moment';

class FyllInnTiltak extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dateFields : [],
            textFields : [],
            gnr_bnr : false
        }
        this.whichFields = this.whichFields.bind(this);
    }

    componentDidMount() {
        this.whichFields(this.props.valgtTrinn[0][0]);
    }

    whichFields(trinn) {
        let dateFields = [], textFields = [];

        if (trinn['Med_forfall']) dateFields.push(['Med_forfall', 'Forfall', new Date(moment(moment.now()).add(14, 'days'))]);
        if (trinn['Med_avholdt']) dateFields.push(['Med_avholdt', 'Avholdt']);
        if (trinn['Med_Forkynnelse']) dateFields.push(['Med_Forkynnelse', 'Forkynt']);

        dateFields.push(["", "Dato", new Date(moment(moment.now()))])

        if (trinn['Med_overskrift']) textFields.push(['Med_overskrift', 'Overskrift', 'Overskrift'])
        if (trinn['Med_adresse']) textFields.push(['Med_adresse', 'Adresse', 'Adresse']);
        if (trinn['Med_fritekst']) textFields.push(['Med_fritekst', 'Tekst', 'Tekst']);
        if (trinn['Med_gards_og_bruksnr'] !== "") textFields.push(["Med_gards_og_bruksnr","Gards_og_bruksnr", "Gård og bruksnummer"]);
        if (trinn['Med_opplysninger']) textFields.push(["Med_opplysninger", 'Opplysninger', trinn["Opplysningstittel"]]);
        if (trinn['Ekstrafelt_1'] !== "") textFields.push(["Ekstrafelt_1", "Ekstrafelt_1", trinn['Ekstrafelt_1']]);
        if (trinn['Ekstrafelt_2'] !== "") textFields.push(["Ekstrafelt_2", "Ekstrafelt_2", trinn['Ekstrafelt_2']]);

        textFields.push(["Melding", "Melding"])
        if (this.props.valgtTrinn[2] !== "") this.props.fillInTiltak(this.props.valgtTrinn[2], "Melding")

        this.setState({
            dateFields : dateFields,
            textFields : textFields
        });

        dateFields.forEach(a => {
          if (a[2] !== undefined) {
            this.props.fillInTiltak(a[2], a[1]);
          }
        })

        const h3Style = {
            marginBottom : "14px",
            fontSize : "23px"
        }
        const h5Style = {
            color : "darkgoldenrod",
            fontSize : "17px"
        }

        if (trinn.Hjelpetekst.length > 0) {
            this.props.setNewTitle(<div><h3 style={h3Style}>{trinn.Navn}</h3><h5 style={h5Style}>{trinn.Hjelpetekst}</h5></div>);
        } else {
            this.props.setNewTitle(<div><h3 style={h3Style}>{trinn.Navn}</h3></div>);
        }
    }



    render() {

        console.log(this.props.valgtTrinn[0][0]);

        const dateFields = this.state.dateFields.map(a => {
            return (
                <DatePickerNorwegian
                    floatingLabelText={a[1]}
                    hintText={a[1]}
                    defaultDate={a[2] !== undefined ? a[2] : null}
                    onChange={(e,date) => {this.props.fillInTiltak(moment(date).format("L").toString(), a[1])}}
                />
            )
        })

        const textFields = this.state.textFields.map(a => {
            return (
                <TextField
                    defaultValue={a[1] === "Melding" ? this.props.valgtTrinn[2].melding : ""}
                    onChange={(e, str) => this.props.fillInTiltak(str, a[1])}
                    hintText={a[2]}
                    multiLine={true}
                />
            )
        })

        return (
            <div>
                {textFields.length > 0 ? <Subheader> Tekstfelt </Subheader> : ""}
                {textFields}
                <Subheader> Datofelt </Subheader>
                {dateFields}
            </div>
        )
    }
}

export default FyllInnTiltak;