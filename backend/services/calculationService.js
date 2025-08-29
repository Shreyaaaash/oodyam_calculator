const { getSheetData } = require('./googleSheetsService');

const calculateCost = async (formData) => {
  const { vendor, pumpCapacity, pumpType, meterHead, quantity, transportationDistance, upfrontPayment, financingDuration } = formData;
  
  const detailsData = await getSheetData('Detail!A2:H');
  console.log('Searching for:', { vendor, pumpCapacity: pumpCapacity.toString(), pumpType, meterHead: meterHead.toString() });
  
  const product = detailsData.find(row => {
    const rowVendor = row[0] || '';
    const rowCapacity = row[1] || '';
    const rowType = row[2] || '';
    const rowMeterHead = row[3] || '';
        return rowVendor === vendor &&
           rowCapacity.toString() === pumpCapacity.toString() &&
           rowType === pumpType &&
           rowMeterHead.toString() === meterHead.toString();
  });
  
  if (!product) {
    console.log('No product found. Available products:');
    detailsData.forEach(row => {
      console.log('Available:', { 
        vendor: row[0], 
        capacity: row[1], 
        type: row[2], 
        meterHead: row[3],
        cost: row[7]
      });
    });
    
    throw new Error('No matching product found for the selected configuration');
  }
  
  const baseCost = parseFloat(product[7]) || 0; 
  const margin = parseFloat(product[5]) / 100 || 0; 
  const gst = parseFloat(product[6]) / 100 || 0; 
  
  // Get transport charge from Transport sheet
  const transportData = await getSheetData('Transport!A2:B');
  let transportCharge = 0;
  
  for (const [distanceRange, charge] of transportData) {
    if (!distanceRange || !charge) continue;
    
    const rangeParts = distanceRange.split('-');
    if (rangeParts.length !== 2) continue;
    
    const min = parseInt(rangeParts[0].replace('km', '').trim());
    const max = parseInt(rangeParts[1].replace('km', '').trim());
    const distance = parseInt(transportationDistance);
    
    if (distance >= min && distance <= max) {
      transportCharge = parseInt(charge) || 0;
      break;
    }
  }
  
  const sellingPrice = baseCost + (baseCost * margin);
  const subtotal = sellingPrice * quantity;
  const preTaxTotal = subtotal + transportCharge;
  const totalCost = preTaxTotal * (1 + gst);
  
  const upfront = parseFloat(upfrontPayment) || 0;
  
  const totalCostLeft = Math.max(0, totalCost - upfront);
  
  const duration = parseInt(financingDuration) || 6;
  
  const interestRate = 0.18; 
  const monthlyPayment = (totalCostLeft * (1 + interestRate)) / duration;
  
  return {
    baseCost,
    sellingPrice,
    subtotal,
    transportCharge,
    preTaxTotal,
    totalCost,
    gstPercent: gst * 100,
    marginPercent: margin * 100,
    upfrontPayment: upfront,
    totalCostLeft,
    financingDuration: duration,
    monthlyPayment: Math.round(monthlyPayment)
  };
};

module.exports = {
  calculateCost
};
// const { getSheetData } = require('./googleSheetsService');

// const calculateCost = async (formData) => {
//   const { vendor, pumpCapacity, pumpType, meterHead, quantity, transportationDistance } = formData;
  
//   // Get product details from Detail sheet
//   const detailsData = await getSheetData('Detail!A2:G');
//   const product = detailsData.find(row => 
//     row[0] === vendor &&
//     row[1] === pumpCapacity &&
//     row[2] === pumpType &&
//     row[3] === meterHead
//   );
  
//   if (!product) {
//     throw new Error('No matching product found for the selected configuration');
//   }
  
//   const baseCost = parseFloat(product[4]) || 0;
//   const margin = parseFloat(product[5]) / 100 || 0;
//   const gst = parseFloat(product[6]) / 100 || 0;
  
//   // Get transport charge from Transport sheet
//   const transportData = await getSheetData('Transport!A2:B');
//   let transportCharge = 0;
  
//   for (const [distanceRange, charge] of transportData) {
//     if (!distanceRange || !charge) continue;
    
//     const rangeParts = distanceRange.split('-');
//     if (rangeParts.length !== 2) continue;
    
//     const min = parseInt(rangeParts[0].replace('km', '').trim());
//     const max = parseInt(rangeParts[1].replace('km', '').trim());
//     const distance = parseInt(transportationDistance);
    
//     if (distance >= min && distance <= max) {
//       transportCharge = parseInt(charge) || 0;
//       break;
//     }
//   }
  
//   // Perform calculations
//   const sellingPrice = baseCost + (baseCost * margin);
//   const subtotal = sellingPrice * quantity;
//   const preTaxTotal = subtotal + transportCharge;
//   const totalCost = preTaxTotal * (1 + gst);
  
//   return {
//     baseCost,
//     sellingPrice,
//     subtotal,
//     transportCharge,
//     preTaxTotal,
//     totalCost,
//     gstPercent: gst * 100,
//     marginPercent: margin * 100
//   };
// };

// module.exports = {
//   calculateCost
// };