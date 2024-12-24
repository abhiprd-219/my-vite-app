import React from "react";

const Dropdown = ({ label, options, value, onChange, darkMode, disabled, placeholder }) => {
    return (
      <div className="w-full md:w-auto">
        <label className="block mb-2 font-medium">{label}</label>
        <select
          className={`w-full md:w-48 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {disabled && <option>{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
export default Dropdown;
