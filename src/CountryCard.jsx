// src/CountryCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const CountryCard = ({ country }) => {
  return (
    <Link
      to={`/country/${country.name.common}`}
      className="p-4 rounded-lg shadow-md text-left hover:shadow-lg transition-shadow duration-300"
    >
      <img
        src={country.flags.svg || country.flags.png}
        alt={`${country.name.common} flag`}
        className="w-full h-32 object-cover rounded-md mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{country.name.common}</h2>
      <p className="text-sm">
        <strong>Region:</strong> {country.region}
      </p>
      <p className="text-sm">
        <strong>Population:</strong> {country.population.toLocaleString()}
      </p>
      <p className="text-sm">
        <strong>Area:</strong> {country.area.toLocaleString()} km²
      </p>
    </Link>
  );
};

export default CountryCard;
