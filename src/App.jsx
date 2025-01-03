import React, { useState, useEffect, useRef } from "react";
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
  const [filters, setFilters] = useState({
    searchTerm: "",
    regionFilter: "",
    subregionFilter: "",
    languageFilter: "",
    sortOption: "",
  });
  const [languages, setLanguages] = useState([]); // Store all unique languages
  const [subregions, setSubregions] = useState([]); // Dynamic subregions based on region filter
  const [countriesData, setCountriesData] = useState([]);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languageInputRef = useRef(null);

  useEffect(() => {
    const fetchCountries = async () => {
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
        console.error(err);
      }
    };

    fetchCountries();
  }, []);

  // Extract unique regions dynamically
  const regions = countriesData.length > 0
    ? [...new Set(countriesData.map((country) => country.region).filter(Boolean))]
    : [];

  // Update subregions when region changes
  useEffect(() => {
    if (filters.regionFilter) {
      const filteredSubregions = countriesData
        .filter((country) => country.region === filters.regionFilter)
        .map((country) => country.subregion)
        .filter(Boolean); // Remove null/undefined values
      setSubregions([...new Set(filteredSubregions)]); // Deduplicate subregions
    } else {
      setSubregions([]); // Clear subregions if no region is selected
    }
  }, [filters.regionFilter, countriesData]);

  // Handle search term for languages
  const handleLanguageSearch = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    setFilters((prev) => ({
      ...prev,
      languageFilter: searchQuery,
    }));
  };

  // Toggle language dropdown visibility when clicking the input
  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen((prev) => !prev);
  };

  // Close the dropdown if clicked outside
  const handleClickOutside = (e) => {
    if (languageInputRef.current && !languageInputRef.current.contains(e.target)) {
      setIsLanguageDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Listen for outside clicks to close the dropdown
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener on unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle Sorting
  const handleSortChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      sortOption: value,
    }));
  };

  // Sort countries based on the selected sorting option
  const sortCountries = (countries) => {
    const { sortOption } = filters;
    if (!sortOption) return countries;

    let sortedCountries = [...countries];
    if (sortOption === "areaAsc") {
      sortedCountries = sortedCountries.sort((a, b) => a.area - b.area);
    } else if (sortOption === "areaDesc") {
      sortedCountries = sortedCountries.sort((a, b) => b.area - a.area);
    } else if (sortOption === "populationAsc") {
      sortedCountries = sortedCountries.sort((a, b) => a.population - b.population);
    } else if (sortOption === "populationDesc") {
      sortedCountries = sortedCountries.sort((a, b) => b.population - a.population);
    }

    return sortedCountries;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6 shadow-md">
        <h1 className="text-2xl md:text-4xl font-bold">Where in the World ?</h1>
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

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between p-6 space-y-4 md:space-y-0">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="w-full md:w-auto shadow-md">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="w-full md:w-64 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.searchTerm}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        searchTerm: e.target.value,
                      }))
                    }
                  />
                </div>
                <Dropdown
                  label="Region"
                  options={regions}
                  value={filters.regionFilter}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      regionFilter: value,
                    }))
                  }
                  darkMode={darkMode}
                />
                <Dropdown
                  label="Subregion"
                  options={subregions}
                  value={filters.subregionFilter}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      subregionFilter: value,
                    }))
                  }
                  darkMode={darkMode}
                  disabled={!filters.regionFilter} // Disable if no region is selected
                />
                {/* Language Dropdown with Search */}
                <div className="relative">
                  <label className="block mb-2">Language</label>
                  <input
                    ref={languageInputRef}
                    type="text"
                    placeholder="Search Language"
                    className="w-full md:w-64 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.languageFilter}
                    onChange={handleLanguageSearch}
                    onClick={toggleLanguageDropdown} // Toggle dropdown visibility on click
                  />
                  {isLanguageDropdownOpen && (
                    <div className="absolute mt-1 w-full bg-white dark:bg-gray-700 border rounded-md max-h-60 overflow-y-auto">
                      {languages
                        .filter((language) =>
                          language.toLowerCase().includes(filters.languageFilter)
                        )
                        .map((language, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                languageFilter: language,
                              }))
                            }
                          >
                            {language}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                {/* Sort Dropdown */}
                <Dropdown
                  label="Sort By"
                  options={["areaAsc", "areaDesc", "populationAsc", "populationDesc"]}
                  value={filters.sortOption}
                  onChange={handleSortChange}
                  darkMode={darkMode}
                />
              </>
            }
          />
        </Routes>
      </div>

      {/* Country List and Country Details */}
      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              <CountryList
                searchTerm={filters.searchTerm}
                regionFilter={filters.regionFilter}
                subregionFilter={filters.subregionFilter}
                languageFilter={filters.languageFilter}
                countriesData={sortCountries(countriesData)} // Pass sorted data
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
