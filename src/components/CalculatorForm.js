import React, { useState, useEffect } from 'react';
import DropdownSelect from './DropdownSelect';
import { useCalculator } from '../context/CalculatorContext';
import { 
  fetchVendors, 
  fetchPumpCapacities, 
  fetchPumpTypes, 
  fetchMeterHeads 
} from '../services/api';
import '../styles/CalculatorForm.css';

const CalculatorForm = () => {
  const { calculate, error, reset } = useCalculator();
  const [formData, setFormData] = useState({
    vendor: '',
    pumpCapacity: '',
    pumpType: '',
    meterHead: '',
    quantity: 1,
    transportationDistance: '',
    upfrontPayment: 0,
    financingDuration: '6'
  });
  
  const [dropdownOptions, setDropdownOptions] = useState({
    vendors: [],
    pumpCapacities: [],
    pumpTypes: [],
    meterHeads: []
  });

  const financingOptions = [
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '18', label: '18 Months' },
    { value: '24', label: '24 Months' }
  ];

  useEffect(() => {
    const initializeData = async () => {
      try {
        const vendors = await fetchVendors();
        setDropdownOptions(prev => ({ ...prev, vendors }));
      } catch (err) {
        console.error('Error initializing data:', err);
      }
    };
    
    initializeData();
  }, []);

  const handleInputChange = async (name, value) => {
    const updatedFormData = { ...formData, [name]: value };
    
    // Reset dependent fields when parent field changes
    if (name === 'vendor') {
      updatedFormData.pumpCapacity = '';
      updatedFormData.pumpType = '';
      updatedFormData.meterHead = '';
      
      // Fetch pump capacities for selected vendor
      const pumpCapacities = await fetchPumpCapacities(value);
      setDropdownOptions(prev => ({ ...prev, pumpCapacities, pumpTypes: [], meterHeads: [] }));
    } 
    else if (name === 'pumpCapacity') {
      updatedFormData.pumpType = '';
      updatedFormData.meterHead = '';
      
      // Fetch pump types for selected vendor and capacity
      const pumpTypes = await fetchPumpTypes(formData.vendor, value);
      setDropdownOptions(prev => ({ ...prev, pumpTypes, meterHeads: [] }));
    } 
    else if (name === 'pumpType') {
      updatedFormData.meterHead = '';
      
      // Fetch meter heads for selected vendor, capacity and type
      const meterHeads = await fetchMeterHeads(formData.vendor, formData.pumpCapacity, value);
      setDropdownOptions(prev => ({ ...prev, meterHeads }));
    }
    
    setFormData(updatedFormData);
    
    // Reset any previous results when form changes
    if (Object.keys(updatedFormData).some(key => updatedFormData[key] !== formData[key])) {
      reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await calculate(formData);
    } catch (err) {
      // Error is already handled in the context
      console.error('Calculation error:', err);
    }
  };

  const isFormValid = () => {
    return (
      formData.vendor &&
      formData.pumpCapacity &&
      formData.pumpType &&
      formData.meterHead &&
      formData.quantity > 0 &&
      formData.transportationDistance !== ''
    );
  };

  return (
    <div className="calculator-form-container">
      <form className="calculator-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="form-section">
          <h3>Product Configuration</h3>
          <div className="form-row">
            <DropdownSelect
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              options={dropdownOptions.vendors}
              onChange={handleInputChange}
              required
            />
            
            <DropdownSelect
              label="Pump Capacity"
              name="pumpCapacity"
              value={formData.pumpCapacity}
              options={dropdownOptions.pumpCapacities}
              onChange={handleInputChange}
              disabled={!formData.vendor}
              required
            />
          </div>
          
          <div className="form-row">
            <DropdownSelect
              label="Pump Type"
              name="pumpType"
              value={formData.pumpType}
              options={dropdownOptions.pumpTypes}
              onChange={handleInputChange}
              disabled={!formData.pumpCapacity}
              required
            />
            
            <DropdownSelect
              label="Meter Head"
              name="meterHead"
              value={formData.meterHead}
              options={dropdownOptions.meterHeads}
              onChange={handleInputChange}
              disabled={!formData.pumpType}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="transportationDistance">Transportation Distance (km):</label>
              <input
                id="transportationDistance"
                type="number"
                name="transportationDistance"
                value={formData.transportationDistance}
                onChange={(e) => handleInputChange('transportationDistance', e.target.value)}
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Financing Options</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="upfrontPayment">Upfront Payment (₹):</label>
              <input
                id="upfrontPayment"
                type="number"
                name="upfrontPayment"
                value={formData.upfrontPayment}
                onChange={(e) => handleInputChange('upfrontPayment', e.target.value)}
                min="0"
                step="100"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="financingDuration">Financing Duration:</label>
              <select
                id="financingDuration"
                name="financingDuration"
                value={formData.financingDuration}
                onChange={(e) => handleInputChange('financingDuration', e.target.value)}
              >
                {financingOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="calculate-button"
          disabled={!isFormValid()}
        >
          Calculate Monthly Payment
        </button>
      </form>
    </div>
  );
};

export default CalculatorForm;


// import React, { useState, useEffect } from 'react';
// import DropdownSelect from './DropdownSelect';
// import { useCalculator } from '../context/CalculatorContext';
// import { 
//   fetchVendors, 
//   fetchPumpCapacities, 
//   fetchPumpTypes, 
//   fetchMeterHeads 
// } from '../services/api';
// import '../styles/CalculatorForm.css';

// const CalculatorForm = () => {
//   const { calculate, error, reset } = useCalculator();
//   const [formData, setFormData] = useState({
//     vendor: '',
//     pumpCapacity: '',
//     pumpType: '',
//     meterHead: '',
//     quantity: 1,
//     transportationDistance: ''
//   });
  
//   const [dropdownOptions, setDropdownOptions] = useState({
//     vendors: [],
//     pumpCapacities: [],
//     pumpTypes: [],
//     meterHeads: []
//   });

//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         const vendors = await fetchVendors();
//         setDropdownOptions(prev => ({ ...prev, vendors }));
//       } catch (err) {
//         console.error('Error initializing data:', err);
//       }
//     };
    
//     initializeData();
//   }, []);

//   const handleInputChange = async (name, value) => {
//     const updatedFormData = { ...formData, [name]: value };
    
//     // Reset dependent fields when parent field changes
//     if (name === 'vendor') {
//       updatedFormData.pumpCapacity = '';
//       updatedFormData.pumpType = '';
//       updatedFormData.meterHead = '';
      
//       // Fetch pump capacities for selected vendor
//       const pumpCapacities = await fetchPumpCapacities(value);
//       setDropdownOptions(prev => ({ ...prev, pumpCapacities, pumpTypes: [], meterHeads: [] }));
//     } 
//     else if (name === 'pumpCapacity') {
//       updatedFormData.pumpType = '';
//       updatedFormData.meterHead = '';
      
//       // Fetch pump types for selected vendor and capacity
//       const pumpTypes = await fetchPumpTypes(formData.vendor, value);
//       setDropdownOptions(prev => ({ ...prev, pumpTypes, meterHeads: [] }));
//     } 
//     else if (name === 'pumpType') {
//       updatedFormData.meterHead = '';
      
//       // Fetch meter heads for selected vendor, capacity and type
//       const meterHeads = await fetchMeterHeads(formData.vendor, formData.pumpCapacity, value);
//       setDropdownOptions(prev => ({ ...prev, meterHeads }));
//     }
    
//     setFormData(updatedFormData);
    
//     // Reset any previous results when form changes
//     if (Object.keys(updatedFormData).some(key => updatedFormData[key] !== formData[key])) {
//       reset();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       await calculate(formData);
//     } catch (err) {
//       // Error is already handled in the context
//       console.error('Calculation error:', err);
//     }
//   };

//   const isFormValid = () => {
//     return (
//       formData.vendor &&
//       formData.pumpCapacity &&
//       formData.pumpType &&
//       formData.meterHead &&
//       formData.quantity > 0 &&
//       formData.transportationDistance !== ''
//     );
//   };

//   return (
//     <div className="calculator-form-container">
//       <form className="calculator-form" onSubmit={handleSubmit}>
//         {error && (
//           <div className="error-message">
//             {error}
//           </div>
//         )}
        
//         <div className="form-row">
//           <DropdownSelect
//             label="Vendor"
//             name="vendor"
//             value={formData.vendor}
//             options={dropdownOptions.vendors}
//             onChange={handleInputChange}
//             required
//           />
          
//           <DropdownSelect
//             label="Pump Capacity"
//             name="pumpCapacity"
//             value={formData.pumpCapacity}
//             options={dropdownOptions.pumpCapacities}
//             onChange={handleInputChange}
//             disabled={!formData.vendor}
//             required
//           />
//         </div>
        
//         <div className="form-row">
//           <DropdownSelect
//             label="Pump Type"
//             name="pumpType"
//             value={formData.pumpType}
//             options={dropdownOptions.pumpTypes}
//             onChange={handleInputChange}
//             disabled={!formData.pumpCapacity}
//             required
//           />
          
//           <DropdownSelect
//             label="Meter Head"
//             name="meterHead"
//             value={formData.meterHead}
//             options={dropdownOptions.meterHeads}
//             onChange={handleInputChange}
//             disabled={!formData.pumpType}
//             required
//           />
//         </div>
        
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="quantity">Quantity:</label>
//             <input
//               id="quantity"
//               type="number"
//               name="quantity"
//               value={formData.quantity}
//               onChange={(e) => handleInputChange('quantity', e.target.value)}
//               min="1"
//               required
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="transportationDistance">Transportation Distance (km):</label>
//             <input
//               id="transportationDistance"
//               type="number"
//               name="transportationDistance"
//               value={formData.transportationDistance}
//               onChange={(e) => handleInputChange('transportationDistance', e.target.value)}
//               min="0"
//               required
//             />
//           </div>
//         </div>
        
//         <button 
//           type="submit" 
//           className="calculate-button"
//           disabled={!isFormValid()}
//         >
//           Calculate Cost
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CalculatorForm;