import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext'; // Import ThemeProvider and useTheme
import CountryList from './CountryList';
import CountryDetail from './CountryDetails';
import Dropdown from './Dropdown';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Main />
      </Router>
    </ThemeProvider>
  );
}

const Main = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error('Failed to fetch countries. Please try again later.');
        }
        const data = await response.json();
        setCountriesData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md">
        <h1 className="text-2xl md:text-4xl font-bold">Where in the World?</h1>
        <button
          onClick={toggleTheme}
          className="flex items-center space-x-2 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          {darkMode ? (
            <>
              {/* <FaSun /> */}
              <span>Light Mode</span>
            </>
          ) : (
            <>
              {/* <FaMoon /> */}
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </header>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center justify-between p-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-auto shadow-md">
          <input
            type="text"
            placeholder="Search countries..."
            className="w-full md:w-64 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dropdown
          label="Region"
          options={['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']}
          value={regionFilter}
          onChange={setRegionFilter}
          darkMode={darkMode}
        />

        <Dropdown
          label="Language"
          options={getLanguageOptions(countriesData)}
          value={languageFilter}
          onChange={setLanguageFilter}
          darkMode={darkMode}
        />

        <Dropdown
          label="Subregion"
          options={getSubregionOptions(regionFilter)}
          value={subregionFilter}
          onChange={setSubregionFilter}
          darkMode={darkMode}
          disabled={!regionFilter}
          placeholder="Select any region first"
        />

        <Dropdown
          label="Sort By"
          options={[
            'Area (Asc)',
            'Area (Desc)',
            'Population (Asc)',
            'Population (Desc)',
          ]}
          value={sortOrder}
          onChange={setSortOrder}
          darkMode={darkMode}
        />
      </div>

      {/* Country List and Country Details Route */}
      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              <CountryList
                searchTerm={searchTerm}
                regionFilter={regionFilter}
                languageFilter={languageFilter}
                subregionFilter={subregionFilter}
                sortOrder={sortOrder}
                countriesData={countriesData}
              />
            }
          />
          <Route
            path="/country/:countryName"
            element={<CountryDetail countries={countriesData} darkMode={darkMode} />}
          />
        </Routes>
      </main>
    </div>
  );
};

const getSubregionOptions = (regionFilter) => {
  const subregionOptions = {
    Africa: ['Northern Africa', 'Southern Africa', 'Central Africa', 'Western Africa', 'Eastern Africa'],
    Americas: ['North America', 'South America', 'Central America', 'Caribbean'],
    Asia: ['Eastern Asia', 'South-Eastern Asia', 'Southern Asia', 'Central Asia', 'Western Asia'],
    Europe: ['Eastern Europe', 'Northern Europe', 'Western Europe', 'Southern Europe'],
    Oceania: ['Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia'],
  };
  return subregionOptions[regionFilter] || [];
};

const getLanguageOptions = (countriesData) => {
  const allLanguages = countriesData.flatMap((country) => {
    if (Array.isArray(country.languages)) {
      return country.languages.map((lang) => lang.iso639_1); // Extract iso639_1 code
    } else if (typeof country.languages === 'object') {
      return Object.keys(country.languages); // Extract language codes from object
    } else {
      return [country.languages]; // Handle cases where languages is a single string
    }
  });

  const uniqueLanguages = [...new Set(allLanguages)];
  return uniqueLanguages;
};

export default App;