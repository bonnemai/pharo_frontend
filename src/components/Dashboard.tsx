import React, {useState, useEffect} from 'react';
import InstrumentTable from './InstrumentTable';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import DarkModeToggle from './DarkModeToggle';
import instrumentData from '../resources/instruments_light.json' assert { type: 'json' };

// Not used. 
export function Dashboard({isDarkMode}: {isDarkMode: boolean}) {
    const [darkMode, setDarkMode] = useState(isDarkMode);

    function handleToggle() {
        setDarkMode((prev) => !prev);
    }

    useEffect(() => {
        setDarkMode(isDarkMode);
    }, [isDarkMode]);
    console.log(instrumentData);

    return (
        <div className="dashboard">
            <DarkModeToggle darkMode={darkMode} onToggle={handleToggle} />
            <SearchBar onSearch={handleSearch} />
            <FilterPanel onFilterChange={handleFilterChange} />
            <InstrumentTable instruments={instrumentData} isDarkMode={isDarkMode} />
        </div>
    );
}

function handleToggle(): void {
    throw new Error('Function not implemented.');
}

function handleSortChange(sortModel: any) {
    // Implement sort functionality
}

function handleFilterChange(filter: string) {
    // Implement filter functionality
}

function handleSearch(searchTerm: string) {
    // Implement search functionality
}


export default Dashboard;