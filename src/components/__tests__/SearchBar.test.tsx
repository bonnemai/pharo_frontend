import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

declare const require: (id: string) => any;

vi.mock('antd', () => {
  const React = require('react');

  const Search = React.forwardRef<HTMLInputElement, any>(
    ({ value, onChange, allowClear: _allowClear, ...rest }, ref) => (
      <input ref={ref} value={value} onChange={onChange} {...rest} />
    )
  );
  Search.displayName = 'Search';

  return {
    Input: {
      Search,
    },
  };
});

import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with the latest value as the user types', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByPlaceholderText('Search by symbol...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'AAPL' } });
    fireEvent.change(input, { target: { value: 'MSFT' } });

    expect(handleSearch).toHaveBeenLastCalledWith('MSFT');
    expect(input.value).toBe('MSFT');
  });

  it('applies a dark wrapper class when darkMode is enabled', () => {
    render(<SearchBar onSearch={() => undefined} darkMode />);

    expect(screen.getByPlaceholderText('Search by symbol...').parentElement).toHaveClass(
      'search-bar search-bar--dark'
    );
  });
});
