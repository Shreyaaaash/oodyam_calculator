import React from 'react';
import { CalculatorProvider } from './context/CalculatorContext';
import CalculatorPage from './pages/CalculatorPage';
import './App.css';

function App() {
  return (
    <CalculatorProvider>
      <div className="App">
        <header className="app-header">
          <h1>Oorja Development Solutions</h1>
          <h2>Cost Calculator</h2>
        </header>
        <main className="app-main">
          <CalculatorPage />
        </main>
      </div>
    </CalculatorProvider>
  );
}

export default App;