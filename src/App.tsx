import { useState } from 'react';
import 'antd/dist/reset.css';
import './styles/App.css';
import DarkModeToggle from './components/DarkModeToggle';
import instrumentData from './resources/instruments.json';
import InstrumentTable from './components/InstrumentTable';
import SearchBar from './components/SearchBar';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState('');

  function handleToggle() {
    setIsDarkMode((prev) => !prev);
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <h1>Dashboard</h1>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        <DarkModeToggle darkMode={isDarkMode} onToggle={handleToggle} />
        <SearchBar onSearch={setFilter} />
      </div>
      <InstrumentTable
        rowData={instrumentData}
        darkMode={isDarkMode}
        filter={filter}
      />
    </div>
  );
};

export default App;