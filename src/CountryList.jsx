import React, { useMemo } from "react";
import CountryCard from "./CountryCard";
import { useTheme } from "./ThemeContext";

const CountryList = ({
  searchTerm,
  regionFilter,
  subregionFilter,
  languageFilter,
  countriesData,
}) => {
  const { darkMode } = useTheme();

  const filteredCountries = useMemo(() => {
    let countries = [...countriesData];

    if (searchTerm) {
      countries = countries.filter((country) =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (regionFilter) {
      countries = countries.filter((country) => country.region === regionFilter);
    }

    if (subregionFilter) {
      countries = countries.filter((country) => country.subregion === subregionFilter);
    }

    if (languageFilter) {
      countries = countries.filter((country) =>
        country.languages
          ? Object.values(country.languages).includes(languageFilter)
          : false
      );
    }

    return countries;
  }, [searchTerm, regionFilter, subregionFilter, languageFilter, countriesData]);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      {filteredCountries.length > 0 ? (
        filteredCountries.map((country) => (
          <CountryCard key={country.cca3} country={country} />
        ))
      ) : (
        <p className="text-center text-xl font-semibold dark:text-white">
          No countries found.
        </p>
      )}
    </div>
  );
};

export default CountryList;
