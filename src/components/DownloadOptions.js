import React from 'react';
import { exportToCSV, exportToExcel } from '../utils/exportUtils';
import '../styles/DownloadOptions.css';

const DownloadOptions = ({ formData, result }) => {
  const handleExport = (format) => {
    const data = {
      vendor: formData.vendor,
      pumpCapacity: formData.pumpCapacity,
      pumpType: formData.pumpType,
      meterHead: formData.meterHead,
      quantity: formData.quantity,
      transportationDistance: formData.transportationDistance,
      baseCost: result.baseCost,
      margin: result.marginPercent,
      sellingPrice: result.sellingPrice,
      subtotal: result.subtotal,
      transportCharge: result.transportCharge,
      preTaxTotal: result.preTaxTotal,
      gst: result.gstPercent,
      totalCost: result.totalCost
    };
    
    if (format === 'csv') {
      exportToCSV(data, 'cost_calculation');
    } else if (format === 'excel') {
      exportToExcel(data, 'cost_calculation');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="download-options">
      <h4>Export Results</h4>
      <div className="button-group">
        <button 
          className="download-button csv-button"
          onClick={() => handleExport('csv')}
        >
          Download as CSV
        </button>
        <button 
          className="download-button excel-button"
          onClick={() => handleExport('excel')}
        >
          Download as Excel
        </button>
        <button 
          className="download-button print-button"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default DownloadOptions;