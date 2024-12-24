import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const CountryList = ({ searchTerm, regionFilter, subregionFilter, sortOrder }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [borderLoading, setBorderLoading] = useState(false);

  // Fetch all countries on initial load
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) {
          throw new Error("Failed to fetch countries. Please try again later.");
        }
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch border countries for the selected country
  useEffect(() => {
    const fetchBorderCountries = async () => {
      if (!selectedCountry?.borders) {
        setBorderCountries([]);
        return;
      }

      setBorderLoading(true);
      try {
        const data = await Promise.all(
          selectedCountry.borders.map((code) =>
            fetch(`https://restcountries.com/v3.1/alpha/${code}`).then((res) =>
              res.ok ? res.json() : null
            )
          )
        );
        setBorderCountries(data.filter(Boolean).map((d) => d[0]));
      } catch (err) {
        console.error("Failed to fetch border countries:", err);
        setBorderCountries([]);
      } finally {
        setBorderLoading(false);
      }
    };

    fetchBorderCountries();
  }, [selectedCountry]);

  // Filter and Sort Logic
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter ? country.region === regionFilter : true;
      const matchesSubregion = subregionFilter
        ? country.subregion === subregionFilter
        : true;

      return matchesSearch && matchesRegion && matchesSubregion;
    });
  }, [countries, searchTerm, regionFilter, subregionFilter]);

  const sortedCountries = useMemo(() => {
    return [...filteredCountries].sort((a, b) => {
      if (sortOrder === "Area (Asc)") {
        return a.area - b.area;
      } else if (sortOrder === "Area (Desc)") {
        return b.area - a.area;
      } else if (sortOrder === "Population (Asc)") {
        return a.population - b.population;
      } else if (sortOrder === "Population (Desc)") {
        return b.population - a.population;
      }
      return 0;
    });
  }, [filteredCountries, sortOrder]);

  if (loading) {
    return <p className="text-center text-xl font-semibold">Loading countries...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-xl font-semibold text-red-500">{error}</p>
    );
  }

  if (sortedCountries.length === 0) {
    return (
      <p className="text-center text-xl font-semibold text-red-500">
        No countries found. Try adjusting your search or filter criteria.
      </p>
    );
  }

  return (
    <div>
      {selectedCountry ? (
        <div className="flex flex-col md:flex-row items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex-1">
            <img
              src={selectedCountry.flags.svg || selectedCountry.flags.png}
              alt={`${selectedCountry.name.common} flag`}
              className="w-full md:w-96 rounded-lg shadow-md object-cover"
            />
          </div>

          <div className="flex-1 mt-6 md:mt-0 md:ml-6 text-left">
            <h2 className="text-3xl font-bold mb-4">{selectedCountry.name.common}</h2>
            <p className="mt-2">
              <strong>Official Name:</strong> {selectedCountry.name.official}
            </p>
            <p className="mt-2">
              <strong>Region:</strong> {selectedCountry.region}
            </p>
            <p className="mt-2">
              <strong>Subregion:</strong> {selectedCountry.subregion || "N/A"}
            </p>
            <p className="mt-2">
              <strong>Capital:</strong> {selectedCountry.capital?.[0] || "N/A"}
            </p>
            <p className="mt-2">
              <strong>Population:</strong> {selectedCountry.population.toLocaleString()}
            </p>
            <p className="mt-2">
              <strong>Area:</strong> {selectedCountry.area.toLocaleString()} km²
            </p>
            <p className="mt-4">
              <strong>Languages:</strong>{" "}
              {selectedCountry.languages
                ? Object.values(selectedCountry.languages).join(", ")
                : "N/A"}
            </p>
            <div className="mt-4">
              <strong>Borders:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {borderLoading ? (
                  <p>Loading border countries...</p>
                ) : borderCountries.length > 0 ? (
                  borderCountries.map((borderCountry) => (
                    <Link
                      to={`/country/${borderCountry.cca3}`}
                      key={borderCountry.cca3}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                      {borderCountry.name.common}
                    </Link>
                  ))
                ) : (
                  <span>No borders</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedCountry(null)}
              className="mt-6 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
            >
              Back to List
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedCountries.map((country) => (
            <Link
              to={`/country/${country.name.common}`}
              key={country.cca3}
              className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-left hover:shadow-lg transition-shadow duration-300"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CountryList;
