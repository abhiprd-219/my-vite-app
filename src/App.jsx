import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, useTheme } from "./ThemeContext";
import CountryList from "./CountryList";
import CountryDetail from "./CountryDetails";
import Dropdown from "./Dropdown";
import { FaSun, FaMoon } from "react-icons/fa";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [subregionFilter, setSubregionFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [languages, setLanguages] = useState([]); // Array to store all unique languages
  const [subregions, setSubregions] = useState([]); // Array to store dynamic subregions
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setCountriesData(data);

        // Extract and store all unique languages
        const allLanguages = data.flatMap((country) =>
          country.languages ? Object.values(country.languages) : []
        );
        setLanguages([...new Set(allLanguages)]); // Deduplicate languages
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Update subregions when region changes
  useEffect(() => {
    if (regionFilter) {
      const filteredSubregions = countriesData
        .filter((country) => country.region === regionFilter)
        .map((country) => country.subregion)
        .filter(Boolean); // Remove null/undefined values
      setSubregions([...new Set(filteredSubregions)]); // Deduplicate subregions
    } else {
      setSubregions([]); // Clear subregions if no region is selected
    }
    setSubregionFilter(""); // Reset subregion filter when region changes
  }, [regionFilter, countriesData]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
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
              <FaSun className="text-yellow-500" /> <span>Light Mode</span>
            </>
          ) : (
            <>
              <FaMoon className="text-blue-500" /> <span>Dark Mode</span>
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
          options={["Africa", "Americas", "Asia", "Europe", "Oceania"]}
          value={regionFilter}
          onChange={setRegionFilter}
          darkMode={darkMode}
        />

        <Dropdown
          label="Subregion"
          options={subregions}
          value={subregionFilter}
          onChange={setSubregionFilter}
          darkMode={darkMode}
          disabled={!regionFilter} // Disable if no region is selected
        />

        <Dropdown
          label="Language"
          options={languages}
          value={languageFilter}
          onChange={setLanguageFilter}
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
                subregionFilter={subregionFilter}
                languageFilter={languageFilter}
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

export default App;
