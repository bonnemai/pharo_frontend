import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import App from './App';

vi.mock('ag-grid-react', () => ({
  AgGridReact: ({ quickFilterText }: { quickFilterText?: string }) => (
    <div data-testid="grid" data-quick-filter={quickFilterText ?? ''} />
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
  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('toggles theme when dark mode switch is activated', async () => {
    render(<App />);
    const root = screen.getByTestId('app-root');
    expect(root).toHaveClass('light-mode');

    fireEvent.click(screen.getByText(/dark/i));

    await waitFor(() => expect(root).toHaveClass('dark-mode'));
  });

  it('passes search term to the grid quick filter', async () => {
    render(<App />);
    const initialGrids = screen.getAllByTestId('grid');
    initialGrids.forEach(node => expect(node).toHaveAttribute('data-quick-filter', ''));

    fireEvent.click(screen.getAllByTestId('search-trigger')[0]);

    await waitFor(() => {
      const filters = screen
        .getAllByTestId('grid')
        .map(node => node.getAttribute('data-quick-filter'));
      expect(filters).toContain('AAPL');
    });
  });
});
