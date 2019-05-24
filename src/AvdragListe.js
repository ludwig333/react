import React, { Component } from 'react';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';

import EikCard from './generics/EikCard';

import './generics/CardHeader.css';

function sak() {
    return decodeURIComponent((new RegExp('[?|&][s|S]ak=([^&;]+?)(&|#|;|$)').exec(decodeURIComponent(location.search)) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

class AvdragListe extends Component {

    render() {

        const avdragsavtaleOrGjeldsordning = (info) => {
          if (info.har_avdragsavtale) return "Avdragsavtale";
          if (info.har_gjeldsordning) return "Gjeldsordning";
        }

        const pdfLink = (nr, type) => {
            return (
                <a href={`Sak?Sak=${sak()}&Fane=4&Avdrag=${nr}&Print=${type}&old=true`}>
                <FontAwesome
                    style={{cursor : "pointer"}}
                    name="file-pdf-o"
                    size="2x"
                />
                </a>
            )
        }

        var avdrag_lst = this.props.avdrag.data
          .slice()
          .sort(
            (a,b) => new Date(a.Registrert).getTime() - new Date(b.Registrert).getTime()
          );

        
          
        const opprettet = avdrag_lst.length > 0 ? moment(avdrag_lst[0].Registrert).format("L") : "";

        avdrag_lst = avdrag_lst.filter(o => o.Betalt === 0);

        var avdrag = avdrag_lst
        .map(o => {
            return (
                <tr>
                    <td> <a href={`/Avdrag?Sak=${o.Sak}&Avdrag=${o.Nr}`}> {moment(o.Registrert).format("L")} </a> </td>
                    <td> {o.Forfall.includes("0000") ? "" : moment(o.Forfall).format("L")} </td>
                    <td> {o.Avdrag} </td>
                    <td> {o.Betalt} </td>
                    <td> {o.Tekst} </td>
                    <td> {pdfLink(o.Nr, "Forvarsel")} </td>
                    <td> {pdfLink(o.Nr, "Purring")} </td>
                </tr>
            );
        });

        if (avdrag.length === 0) return null;
        

        return (
                <EikCard
                    title={avdragsavtaleOrGjeldsordning(this.props.genInfo)}
                    subtitle={`Opprettet : ${opprettet}`}
                    subtitleColor="#c6c4c4"
                >
				<table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th> Dato </th>
                            <th> Forfall </th>
                            <th> Avdrag </th>
                            <th> Betalt </th>
                            <th> Tekst </th>
                            <th> Forvarsel </th>
                            <th> Purring </th>
                        </tr>
                    </thead>
					<tbody>
                        {avdrag}
                    </tbody>
                </table>
                </EikCard>
        )
    }
}

export default AvdragListe;
