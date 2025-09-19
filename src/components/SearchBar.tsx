import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="search-bar">
            <Search
                placeholder="Search by symbol..."
                value={searchTerm}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchBar;