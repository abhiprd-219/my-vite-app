import React, { useMemo } from 'react';
import CountryCard from './CountryCard'; // Import the CountryCard component
import { useTheme } from './ThemeContext'; // Import useTheme from context

const CountryList = ({ 
  searchTerm, 
  regionFilter, 
  subregionFilter, 
  sortOrder, 
  countriesData, 
  languageFilter 
}) => {
  const { darkMode } = useTheme();

  const filteredCountries = useMemo(() => {
    let countries = [...countriesData];

    // Filter by search term
    if (searchTerm) {
      countries = countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by region
    if (regionFilter) {
      countries = countries.filter(
        (country) => country.region === regionFilter
      );
    }

    // Filter by language
    if (languageFilter) {
      countries = countries.filter((country) => {
        if (Array.isArray(country.languages)) {
          return country.languages.some(
            (lang) => lang.iso639_1.toLowerCase() === languageFilter.toLowerCase()
          );
        } else if (typeof country.languages === 'object') {
          return Object.keys(country.languages).some(
            (code) => code.toLowerCase() === languageFilter.toLowerCase()
          );
        } else {
          return country.languages.toLowerCase() === languageFilter.toLowerCase();
        }
      });
    }

    // Filter by subregion
    if (subregionFilter) {
      countries = countries.filter(
        (country) => country.subregion === subregionFilter
      );
    }

    // Sort the countries based on selected sort order
    if (sortOrder) {
      switch (sortOrder) {
        case 'Area (Asc)':
          countries = countries.sort((a, b) => a.area - b.area);
          break;
        case 'Area (Desc)':
          countries = countries.sort((a, b) => b.area - a.area);
          break;
        case 'Population (Asc)':
          countries = countries.sort((a, b) => a.population - b.population);
          break;
        case 'Population (Desc)':
          countries = countries.sort((a, b) => b.population - b.population);
          break;
        default:
          break;
      }
    }

    return countries;
  }, [searchTerm, regionFilter, subregionFilter, sortOrder, countriesData, languageFilter]); 

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
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