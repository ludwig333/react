import React from "react";
import Dialog from "material-ui/Dialog";
import moment from "moment";
import xlsx from "xlsx";
import FileSaver from "file-saver";
import FlatButton from "material-ui/FlatButton";
import "./UtregningDisplay.css";

class UtregningDisplay extends React.Component {
  getXLSX = d => {
    var data = JSON.parse(JSON.stringify(d));
    data.forEach(a => {
      a.Dato = moment(a.Dato).format("L");
    });
    let lastrow = data[data.length - 1];
    lastrow.Hovedstol = lastrow.SumHovedstol;
    lastrow.Salær = lastrow.Saler;
    delete lastrow.SumHovedstol;
    delete lastrow.Saler;

    var wb = { SheetNames: [], Sheets: {} };
    wb.SheetNames.push("Utregning");
    var ws = xlsx.utils.json_to_sheet(data);
    wb.Sheets["Utregning"] = ws;

    var wopts = { bookType: "xlsx", bookSST: false, type: "array" };
    var wbout = xlsx.write(wb, wopts);

    FileSaver.saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "utregning.xlsx"
    );
  };

  render() {
    const { data, dialogOpen } = this.props;

    const styleRightalign = {
      textAlign: "right",
      color: "black"
    };

    const styleBoldFont = {
      fontWeight: "bolder",
      textAlign: "right",
      color: "black"
    };

    const styleHeader = {
      textAlign: "right",
      color: "black"
    };

    const styleBlack = {
      color: "black"
    };

    const utregningRows = () => {
      let d = JSON.parse(JSON.stringify(data));
      let rows = d.splice(0, data.length - 2).map(a => {
        return (
          <tr>
            <td style={styleBlack}> {moment(a.Dato).format("L")} </td>
            <td style={styleRightalign}> {a.Hovedstol} </td>
            <td style={styleRightalign}> {a.Salær} </td>
            <td style={styleRightalign}> {a.Omk} </td>
            <td style={styleRightalign}> {a.Innbetalinger} </td>
            <td style={styleRightalign}> {a.SaldoRenteberende} </td>
            <td style={styleRightalign}> {a.Rentefot} </td>
            <td style={styleRightalign}> {a.Renter} </td>
            <td style={styleRightalign}> {a.Saldo} </td>
            <td style={styleBlack}> {a.Kommentar} </td>
          </tr>
        );
      });
      return rows;
    };

    const sum = JSON.parse(JSON.stringify(data))
      .splice(data.length - 2, data.length - 1)
      .map(a => {
        return (
          <tr>
            <td style={styleBlack}> {moment(a.Dato).format("L")} </td>
            <td style={styleBoldFont}> {a.SumHovedstol} </td>
            <td style={styleBoldFont}> {a.Saler} </td>
            <td style={styleBoldFont}> {a.Omk} </td>
            <td style={styleBoldFont}> {a.Innbetalinger} </td>
            <td style={styleBoldFont} />
            <td style={styleBoldFont} />
            <td style={styleBoldFont}> {a.Renter} </td>
            <td style={styleBoldFont}> {a.Saldo} </td>
            <td style={styleBlack}> {a.Kommentar} </td>
          </tr>
        );
      });

    const actions = [
      <FlatButton onTouchTap={e => this.props.openClose()} label="Lukk" />,
      <FlatButton onTouchTap={e => this.getXLSX(data)} label="Last ned" />
    ];

    return (
      <Dialog
        autoScrollBodyContent={true}
        open={dialogOpen}
        title="Utregning"
        contentStyle={{ width: "80%", maxWidth: "none" }}
        actions={actions}
      >
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th style={styleBlack}> Dato </th>
              <th style={styleHeader}> Hovedstol </th>
              <th style={styleHeader}> Salær </th>
              <th style={styleHeader}> Omk. </th>
              <th style={styleHeader}> Betalt </th>
              <th style={styleHeader}> Rentegr </th>
              <th style={styleHeader}> Rentefot </th>
              <th style={styleHeader}> Renter </th>
              <th style={styleHeader}> Saldo </th>
              <th style={styleBlack}> Kommentar </th>
            </tr>
          </thead>
          <tbody>
            {utregningRows()}
            {sum}
          </tbody>
        </table>
      </Dialog>
    );
  }
}

export default UtregningDisplay;
