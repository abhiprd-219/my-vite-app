import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from './ThemeContext'; // Import useTheme from ThemeContext

const CountryDetail = () => {
  const { countryName } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // Get darkMode from ThemeContext

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );
        if (!response.ok) {
          throw new Error("Country not found");
        }
        const data = await response.json();
        const fetchedCountry = data[0];
        setCountry(fetchedCountry);

        if (fetchedCountry.borders) {
          const borderResponses = await Promise.all(
            fetchedCountry.borders.map((code) =>
              fetch(`https://restcountries.com/v3.1/alpha/${code}`)
            )
          );
          const borderData = await Promise.all(borderResponses.map((res) => res.json()));
          setBorderCountries(borderData.map((border) => border[0]));
        } else {
          setBorderCountries([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryName]);

  const handleBorderCountryClick = (name) => {
    navigate(`/country/${name}`);
  };

  if (loading) {
    return <p className="text-center text-xl font-semibold">Loading country details...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-xl font-semibold text-red-500">{error}</p>
    );
  }

  if (!country) {
    return (
      <p className="text-center text-xl font-semibold text-red-500">
        Country not found.
      </p>
    );
  }

  return (
    <div className={`p-10 rounded-lg shadow-md flex flex-col md:flex-row gap-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} transition-colors duration-300`}> 
      {/* Left Side: Back Button and Image */}
      <div className="flex flex-col items-center md:items-start">
      <Link
  to="/"
  className="mb-4 px-12 py-4 rounded-md bg-white text-black border border-black hover:bg-gray-100 text-lg"
>
          Go Back
        </Link>
        <img
          src={country.flags.svg || country.flags.png}
          alt={`${country.name.common} flag`}
          className="w-full md:w-96 rounded-lg shadow-md object-cover"
        />
      </div>

      {/* Right Side: Country Details */}
      <div className="flex-4">
        <h2 className="text-3xl font-bold mb-4">{country.name.common}</h2>
        <p className="mt-2">
          <strong>Official Name:</strong> {country.name.official}
        </p>
        <p className="mt-2">
          <strong>Region:</strong> {country.region}
        </p>
        <p className="mt-2">
          <strong>Subregion:</strong> {country.subregion || "N/A"}
        </p>
        <p className="mt-2">
          <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
        </p>
        <p className="mt-2">
          <strong>Population:</strong> {country.population.toLocaleString()}
        </p>
        <p className="mt-2">
          <strong>Area:</strong> {country.area.toLocaleString()} km²
        </p>
        <p className="mt-4">
          <strong>Languages:</strong>{" "}
          {country.languages
            ? Object.values(country.languages).join(", ")
            : "N/A"}
        </p>
        <div className="mt-6">
          <strong>Bordering Countries:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {borderCountries.length > 0 ? (
              borderCountries.map((borderCountry) => (
                <button
                  key={borderCountry.cca3}
                  onClick={() => handleBorderCountryClick(borderCountry.name.common)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  {borderCountry.name.common}
                </button>
              ))
            ) : (
              <span>No bordering countries</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;