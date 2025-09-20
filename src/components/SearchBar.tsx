import React, { useState } from 'react';
import { Input } from 'antd';

const { Search } = Input;

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  darkMode?: boolean;
}

function SearchBar({ onSearch, darkMode = false }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  }

  const wrapperClass = darkMode ? 'search-bar search-bar--dark' : 'search-bar';

  return (
    <div className={wrapperClass}>
      <Search
        className="search-bar__input"
        placeholder="Search by symbol..."
        value={searchTerm}
        onChange={handleChange}
        allowClear
      />
    </div>
  );
}

export default SearchBar;
