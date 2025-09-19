import { useState } from 'react';
import 'antd/dist/reset.css';
import './styles/App.css';
import DarkModeToggle from './components/DarkModeToggle';
import instrumentData from './resources/instruments.json';
import InstrumentTable2 from 'components/InstrumentTable2';
import SearchBar from 'components/SearchBar';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState('');

  function handleToggle() {
    setIsDarkMode((prev) => !prev);
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <DarkModeToggle darkMode={isDarkMode} onToggle={handleToggle} />
      <SearchBar onSearch={setFilter} />
      <InstrumentTable2
        rowData={instrumentData}
        darkMode={isDarkMode}
        filter={filter}
      />
    </div>
  );
};

export default App;