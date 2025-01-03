import React from "react";

const Dropdown = ({ label, options, value, onChange, darkMode, disabled }) => {
  return (
    <div className="relative w-full md:w-48">
      <label className="block mb-2 text-sm font-medium">{label}</label>
      <select
        className={`w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white border ${
          darkMode ? "border-gray-600" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
