import React from 'react';
import * as XLSX from 'xlsx';
import moment from 'moment';

const ExcelUpload = ({ onFileLoaded }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Extract constant fields
      const saleDate = moment(worksheet['J2'].w, 'MM/DD/YYYY').format('MM/DD/YY');
      const customer = worksheet['D6'].v;

      // Extract trucks data
      const trucks = [];
      let row = 11;
      while (true) {
        const fleetNumber = worksheet['C' + row]?.v;
        if (!fleetNumber) break; // Stop if there are no more trucks

        const year = worksheet['D' + row].v;
        const make = worksheet['E' + row].v;
        const model = worksheet['F' + row].v;
        const vinSerial = worksheet['G' + row].v.trim(); // Trim the VIN value
        const location = worksheet['I' + row].v;
        const soldPrice = worksheet['J' + row].v;

        trucks.push({
          truckinfo: {
            fleetNumber,
            customer,
            saleDate,
            year,
            make,
            model,
            vinSerial,
            location,
            soldPrice
          }
        });

        row++;
      }

      onFileLoaded(trucks); // Pass the truck data to the parent component
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <button onClick={() => document.getElementById('excelFileInput').click()} className="btn btn-info me-2">Upload Excel</button>
      <input type="file" id="excelFileInput" style={{ display: 'none' }} onChange={handleFileChange} accept=".xlsx, .xls" />
    </>
  );
};

export default ExcelUpload;
