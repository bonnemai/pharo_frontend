import React from 'react';

// Not used
function FilterPanel({ onFilterChange }: { onFilterChange: (filter: string) => void }) {
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