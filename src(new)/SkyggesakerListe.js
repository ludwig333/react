import React from 'react';
import moment from 'moment';

import EikCard from './generics/EikCard';

class SkyggesakerListe extends React.Component {

    render() {

        if (this.props.data.length === 0) return null;

        const skyggesaker = this.props.data.map(o => {
            return (
            <tr>
                <td>
                    <a key={o.Nr} href={`/sak?sak=${o.Nr}`}> {o.Nr} </a>
                </td>
                <td> {moment(o.Registrert).format("L")} </td>
            </tr>
            )
        })

        return (
            <EikCard
                title="Skyggesaker"
            >
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th> Nr </th>
                            <th> Dato </th>
                        </tr>
                    </thead>
					<tbody>
                        {skyggesaker}
                    </tbody>
                </table>
            </EikCard>
        )
    }

}

export default SkyggesakerListe;
