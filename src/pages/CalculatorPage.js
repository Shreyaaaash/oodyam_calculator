import React from 'react';
import CalculatorForm from '../components/CalculatorForm';
import ResultDisplay from '../components/ResultDisplay';
import { useCalculator } from '../context/CalculatorContext';
import '../styles/CalculatorPage.css';

const CalculatorPage = () => {
  const { result, loading } = useCalculator();

  return (
    <div className="calculator-page">
      <div className="calculator-container">
        <CalculatorForm />
        
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Calculating...</p>
          </div>
        )}
        
        {result && <ResultDisplay />}
      </div>
    </div>
  );
};

export default CalculatorPage;