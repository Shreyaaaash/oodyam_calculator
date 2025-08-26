import React, { createContext, useContext, useReducer } from 'react';
import { calculateCost } from '../services/api';

// Action types
const SET_LOADING = 'SET_LOADING';
const SET_RESULT = 'SET_RESULT';
const SET_ERROR = 'SET_ERROR';
const RESET = 'RESET';

// Initial state
const initialState = {
  loading: false,
  result: null,
  formData: null,
  error: null
};

// Reducer
const calculatorReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    case SET_RESULT:
      return { 
        ...state, 
        loading: false, 
        result: action.payload.result, 
        formData: action.payload.formData,
        error: null 
      };
    case SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

// Context
const CalculatorContext = createContext();

// Provider component
export const CalculatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const performCalculation = async (formData) => {
    dispatch({ type: SET_LOADING, payload: true });
    
    try {
      const result = await calculateCost(formData);
      dispatch({ 
        type: SET_RESULT, 
        payload: { result, formData } 
      });
    } catch (error) {
      dispatch({ 
        type: SET_ERROR, 
        payload: error.message || 'An error occurred during calculation' 
      });
      throw error;
    }
  };

  const resetCalculator = () => {
    dispatch({ type: RESET });
  };

  const value = {
    ...state,
    calculate: performCalculation,
    reset: resetCalculator
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

// Custom hook to use the calculator context
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};