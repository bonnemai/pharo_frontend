import React, { useState } from 'react';
import 'antd/dist/reset.css';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'ag-grid-community/styles/ag-theme-alpine-dark.css';
// import './styles/ag-dark-override.css';
import DarkModeToggle from './components/DarkModeToggle';
// import InstrumentTable from './components/InstrumentTable';
import './styles/App.css';
import instrumentData from './resources/instruments_light.json';
import InstrumentTable2 from 'components/InstrumentTable2';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  function handleToggle() {
    setDarkMode((prev) => !prev);
  }

  console.log('Rendering App in', darkMode ? 'dark' : 'light', 'mode', instrumentData.length);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <DarkModeToggle darkMode={darkMode} onToggle={handleToggle} />
      <InstrumentTable2
        rowData={instrumentData}
        darkMode={darkMode}
        // onSortChange={handleSortChange}
        // onFilterChange={handleFilterChange}
        // onSearch={handleSearch}
      />
    </div>
  );
};

function handleSortChange(sortModel: any) {
  // Implement sort functionality
}

function handleFilterChange(filter: string) {
  // Implement filter functionality
}

function handleSearch(searchTerm: string) {
  // Implement search functionality
}

export default App;