import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportCSV = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const csv = XLSX.write(workbook, {
    bookType: "csv",
    type: "array",
  });

  saveAs(new Blob([csv]), `${filename}.csv`);
};

export const exportExcel = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};