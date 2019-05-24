import React from 'react';
import { connect } from 'react-redux';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import {
    fetchSaksganger,
    fetchTiltak,
    updateSak
} from './modules/actions';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;}

class EndreSaksgang extends React.Component {

    constructor(props) {
        super(props);

        this.state = {saksgang : ""};
    }

    componentDidMount() {
        this.props.dispatch(fetchSaksganger(sak()))
        this.setState({saksgang : this.props.saksgang});
    }

    handleChangeSaksgang = (e, i, v) => {
        this.props.dispatch(updateSak(sak(), JSON.stringify({Saksgang : v})))
        .then(() => this.props.dispatch(fetchTiltak(sak())))
    }

    render() {

        const {loading, data} = this.props;

        if (loading) return null;

        return (
            <SelectField
                listStyle={{fontSize : "6pt"}}
                value={this.props.saksgang}
                style={{verticalAlign : "middle", float : "right"}}
                onChange={this.handleChangeSaksgang}
            >
            {data.map((a,i) => {
                return <MenuItem value={a.Kode} primaryText={a.Kode} />
            })}
            </SelectField>
        )
    }

}

function mapStateToProps(state) {
    const { saksganger, generellInfo } = state;
    const data = saksganger.data;
    const loading = saksganger.loading;
    const saksgang = generellInfo.data.Saksgang;
    return {
        data,
        loading,
        saksgang
    }
}

export default connect(mapStateToProps)(EndreSaksgang);
