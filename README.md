# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Project Workflow

When the app loads, the useEffect hook in CountryList.jsx fetches the country data from the restcountries.com API and stores it in the state using useState.

The useState hooks are also used for managing the search query and the selected region filter, ensuring that the UI updates in real-time as users type in the search bar or select a region from the dropdown.

The useContext hook allows the theme to be accessed across different components, and the toggleTheme function enables users to toggle between dark and light modes.

The CountryList component displays the country cards, which when clicked navigate to the CountryDetail component for more detailed information about a specific country.

Each country card displays the country's flag, population, area, and other relevant details, while the country detail view shows even more in-depth information.