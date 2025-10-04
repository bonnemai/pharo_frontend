import { render, screen } from '@testing-library/react';
import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Instrument } from '../../types/Instrument';

declare function require<T = unknown>(id: string): T;

type MockAgGridProps = {
  quickFilterText?: string;
  rowData?: unknown[];
  pagination?: boolean;
  paginationPageSize?: number;
  columnDefs?: unknown[];
};

let lastAgGridProps: MockAgGridProps | undefined;

vi.mock('ag-grid-community', () => ({
  AllCommunityModule: { moduleName: 'all' },
  colorSchemeDark: { name: 'dark' },
  colorSchemeLight: { name: 'light' },
  ModuleRegistry: { registerModules: vi.fn() },
  themeQuartz: { withPart: vi.fn((scheme: unknown) => ({ scheme })) },
}));

vi.mock('../SparklineRenderer', () => ({
  default: vi.fn(),
}));

vi.mock('ag-grid-react', () => {
  const React = require('react');

  return {
    AgGridReact: (props: MockAgGridProps) => {
      lastAgGridProps = props;
      const rowCount = Array.isArray(props.rowData) ? props.rowData.length : 0;
      return (
        <div
          data-testid="ag-grid"
          data-quick-filter={props.quickFilterText ?? ''}
          data-row-count={rowCount}
        />
      );
    },
  };
});

import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  colorSchemeDark,
  colorSchemeLight,
} from 'ag-grid-community';
import InstrumentTable from '../InstrumentTable';

const registerModulesMock = ModuleRegistry.registerModules as Mock;
const themeWithPartMock = themeQuartz.withPart as Mock;

describe('InstrumentTable', () => {
  beforeEach(() => {
    lastAgGridProps = undefined;
    themeWithPartMock.mockClear();
  });

  it('registers the community module on import', () => {
    expect(registerModulesMock).toHaveBeenCalledWith([AllCommunityModule]);
  });

  it('renders a light themed grid and forwards key props', () => {
    const row: Instrument = { id: 1, symbol: 'AAPL', price: 220.15, pnl: 5.32, sparkline: [] };

    render(<InstrumentTable darkMode={false} filter="AAPL" rowData={[row]} />);

    const grid = screen.getByTestId('ag-grid');
    const container = grid.closest('.instrument-table');

    expect(grid).toHaveAttribute('data-quick-filter', 'AAPL');
    expect(grid).toHaveAttribute('data-row-count', '1');
    expect(container).not.toBeNull();
    expect(container as HTMLElement).toHaveClass('instrument-table', 'instrument-table--light');

    expect(lastAgGridProps?.pagination).toBe(true);
    expect(lastAgGridProps?.paginationPageSize).toBe(20);
    expect(lastAgGridProps?.columnDefs).toHaveLength(4);

    expect(themeWithPartMock).toHaveBeenCalledWith(colorSchemeLight);
  });

  it('switches to the dark theme when requested', () => {
    render(<InstrumentTable darkMode rowData={[]} />);

    const container = screen.getByTestId('ag-grid').closest('.instrument-table');

    expect(container).not.toBeNull();
    expect(container as HTMLElement).toHaveClass('instrument-table', 'instrument-table--dark');
    expect(themeWithPartMock).toHaveBeenCalledWith(colorSchemeDark);
  });
});
