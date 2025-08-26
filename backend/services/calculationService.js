const { getSheetData } = require('./googleSheetsService');

const calculateCost = async (formData) => {
  const { vendor, pumpCapacity, pumpType, meterHead, quantity, transportationDistance } = formData;
  
  // Get product details from Detail sheet
  const detailsData = await getSheetData('Detail!A2:G');
  const product = detailsData.find(row => 
    row[0] === vendor &&
    row[1] === pumpCapacity &&
    row[2] === pumpType &&
    row[3] === meterHead
  );
  
  if (!product) {
    throw new Error('No matching product found for the selected configuration');
  }
  
  const baseCost = parseFloat(product[4]) || 0;
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
  
  // Perform calculations
  const sellingPrice = baseCost + (baseCost * margin);
  const subtotal = sellingPrice * quantity;
  const preTaxTotal = subtotal + transportCharge;
  const totalCost = preTaxTotal * (1 + gst);
  
  return {
    baseCost,
    sellingPrice,
    subtotal,
    transportCharge,
    preTaxTotal,
    totalCost,
    gstPercent: gst * 100,
    marginPercent: margin * 100
  };
};

module.exports = {
  calculateCost
};