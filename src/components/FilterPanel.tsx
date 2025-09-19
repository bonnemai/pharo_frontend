import React from 'react';

const FilterPanel: React.FC<{ onFilterChange: (filter: string) => void }> = ({ onFilterChange }) => {
    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange(event.target.value);
    };

    return (
        <div className="filter-panel">
            <input
                type="text"
                placeholder="Filter by symbol"
                onChange={handleFilterChange}
            />
        </div>
    );
};

export default FilterPanel;