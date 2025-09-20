import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
import App from './App';

vi.mock('ag-grid-react', () => ({
  AgGridReact: ({ quickFilterText }: { quickFilterText?: string }) => (
    <div data-testid="grid" data-quick-filter={quickFilterText ?? ''} />
  ),
}));

vi.mock('./components/DarkModeToggle', () => ({
  default: ({ darkMode, onToggle }: { darkMode: boolean; onToggle: () => void }) => (
    <button data-testid="dark-mode-toggle" data-dark={darkMode} onClick={onToggle}>
      toggle
    </button>
  ),
}));

vi.mock('./components/SearchBar', () => ({
  default: ({ onSearch }: { onSearch: (value: string) => void }) => (
    <button data-testid="search-trigger" onClick={() => onSearch('AAPL')}>
      search
    </button>
  ),
}));

describe('App', () => {
  it('toggles theme when dark mode switch is activated', async () => {
    render(<App />);
    const root = screen.getByTestId('app-root');
    expect(root).toHaveClass('light-mode');

    fireEvent.click(screen.getByTestId('dark-mode-toggle'));

    await waitFor(() => expect(root).toHaveClass('dark-mode'));
  });

  it.skip('passes search term to the grid quick filter', async () => {
    render(<App />);
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveAttribute('data-quick-filter', '');

    fireEvent.click(screen.getByTestId('search-trigger'));

    await waitFor(() => expect(grid).toHaveAttribute('data-quick-filter', 'AAPL'));
  });
});
