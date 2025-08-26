import React from 'react';

const DropdownSelect = ({ label, name, value, options, onChange, disabled, required }) => {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}:</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelect;