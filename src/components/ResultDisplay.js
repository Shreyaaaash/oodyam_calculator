import React from 'react';
import DownloadOptions from './DownloadOptions';
import { useCalculator } from '../context/CalculatorContext';
import '../styles/ResultDisplay.css';

const ResultDisplay = () => {
  const { result, formData } = useCalculator();

  if (!result || !formData) return null;

  return (
    <div className="result-container">
      <h3 className="result-title">Monthly Payment Calculation Results</h3>
      
      <div className="result-content">
        <div className="result-summary">
          <table className="result-table">
            <tbody>
              <tr>
                <th>Vendor</th>
                <td>{formData.vendor}</td>
              </tr>
              <tr>
                <th>Pump Capacity</th>
                <td>{formData.pumpCapacity}</td>
              </tr>
              <tr>
                <th>Pump Type</th>
                <td>{formData.pumpType}</td>
              </tr>
              <tr>
                <th>Meter Head</th>
                <td>{formData.meterHead}</td>
              </tr>
              <tr>
                <th>Quantity</th>
                <td>{formData.quantity}</td>
              </tr>
              <tr>
                <th>Transportation Distance</th>
                <td>{formData.transportationDistance} km</td>
              </tr>
              <tr className="highlight">
                <th>Total Cost</th>
                <td>₹{result.totalCost.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Upfront Payment</th>
                <td>₹{result.upfrontPayment.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Amount to Finance</th>
                <td>₹{result.totalCostLeft.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Financing Duration</th>
                <td>{result.financingDuration} Months</td>
              </tr>
              <tr className="highlight final-payment">
                <th>Monthly Payment</th>
                <td>₹{result.monthlyPayment.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <DownloadOptions formData={formData} result={result} />
        
        <div className="calculation-details">
          <h4>Calculation Details</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Base Cost:</span>
              <span className="detail-value">₹{result.baseCost.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Margin ({result.marginPercent}%):</span>
              <span className="detail-value">₹{(result.baseCost * result.marginPercent/100).toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Selling Price:</span>
              <span className="detail-value">₹{result.sellingPrice.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Subtotal (×{formData.quantity}):</span>
              <span className="detail-value">₹{result.subtotal.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Transport Charge:</span>
              <span className="detail-value">₹{result.transportCharge.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pre-Tax Total:</span>
              <span className="detail-value">₹{result.preTaxTotal.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">GST ({result.gstPercent}%):</span>
              <span className="detail-value">₹{(result.preTaxTotal * result.gstPercent/100).toFixed(2)}</span>
            </div>
            <div className="detail-item highlight">
              <span className="detail-label">Total Cost:</span>
              <span className="detail-value">₹{result.totalCost.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Interest Rate:</span>
              <span className="detail-value">18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;

// import React from 'react';
// import DownloadOptions from './DownloadOptions';
// import { useCalculator } from '../context/CalculatorContext';
// import '../styles/ResultDisplay.css';

// const ResultDisplay = () => {
//   const { result, formData } = useCalculator();

//   if (!result || !formData) return null;

//   return (
//     <div className="result-container">
//       <h3 className="result-title">Cost Calculation Results</h3>
      
//       <div className="result-content">
//         <div className="result-summary">
//           <table className="result-table">
//             <tbody>
//               <tr>
//                 <th>Vendor</th>
//                 <td>{formData.vendor}</td>
//               </tr>
//               <tr>
//                 <th>Pump Capacity</th>
//                 <td>{formData.pumpCapacity}</td>
//               </tr>
//               <tr>
//                 <th>Pump Type</th>
//                 <td>{formData.pumpType}</td>
//               </tr>
//               <tr>
//                 <th>Meter Head</th>
//                 <td>{formData.meterHead}</td>
//               </tr>
//               <tr>
//                 <th>Quantity</th>
//                 <td>{formData.quantity}</td>
//               </tr>
//               <tr>
//                 <th>Transportation Distance</th>
//                 <td>{formData.transportationDistance} km</td>
//               </tr>
//               <tr className="highlight">
//                 <th>Final Cost</th>
//                 <td>₹{result.totalCost.toFixed(2)}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
        
//         <DownloadOptions formData={formData} result={result} />
        
//         <div className="calculation-details">
//           <h4>Calculation Details</h4>
//           <div className="details-grid">
//             <div className="detail-item">
//               <span className="detail-label">Base Cost:</span>
//               <span className="detail-value">₹{result.baseCost.toFixed(2)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">Margin ({result.marginPercent}%):</span>
//               <span className="detail-value">₹{(result.baseCost * result.marginPercent/100).toFixed(2)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">Selling Price:</span>
//               <span className="detail-value">₹{result.sellingPrice.toFixed(2)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">Subtotal (×{formData.quantity}):</span>
//               <span className="detail-value">₹{result.subtotal.toFixed(2)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">Transport Charge:</span>
//               <span className="detail-value">₹{result.transportCharge.toFixed(2)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">Pre-Tax Total:</span>
//               <span className="detail-value">₹{result.preTaxTotal.toFixed(2)}</span>
//             </div>
//             <div className="detail-item">
//               <span className="detail-label">GST ({result.gstPercent}%):</span>
//               <span className="detail-value">₹{(result.preTaxTotal * result.gstPercent/100).toFixed(2)}</span>
//             </div>
//             <div className="detail-item highlight">
//               <span className="detail-label">Total Cost:</span>
//               <span className="detail-value">₹{result.totalCost.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultDisplay;