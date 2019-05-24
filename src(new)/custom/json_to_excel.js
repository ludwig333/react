import xlsx from 'xlsx';
import FileSaver from 'file-saver';

export default function json_to_excel(d, sheetname) {
  var data = JSON.parse(JSON.stringify(d));
  console.log(data);
  var wb = { SheetNames:[], Sheets:{} };
  wb.SheetNames.push(sheetname);
  var ws = xlsx.utils.json_to_sheet(data);
  wb.Sheets[sheetname] = ws;

  var wopts = { bookType:'xlsx', bookSST:false, type:'array' };
  var wbout = xlsx.write(wb,wopts);

  FileSaver.saveAs(new Blob([wbout],{type:"application/octet-stream"}), `${sheetname}.xlsx`);
}
