import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, colorSchemeDark, colorSchemeLight, ModuleRegistry, themeQuartz } from "ag-grid-community";
import SparklineRenderer from "./SparklineRenderer";
import { Instrument } from "../types/Instrument";

ModuleRegistry.registerModules([ AllCommunityModule ]);

export type InstrumentTable2Props = {
  rowData?: Instrument[];
  darkMode: boolean;
  filter?: string;
};

export default function InstrumentTable({rowData, darkMode, filter}: InstrumentTable2Props) {
  const cols = useMemo<ColDef[]>(
    () => [
      { headerName: "Symbol", field: "symbol", pinned: "left", width: 140 },
      { headerName: "Price", field: "price", type: "rightAligned", width: 100,
        valueFormatter: p => valueFormatter(p.value) },
      { headerName: "P&L", field: "pnl", type: "rightAligned", width: 90,
        valueFormatter: p => (p.value >= 0 ? `+${valueFormatter(p.value)}` : `${valueFormatter(p.value)}`),
        cellStyle: params => ({ color: params.value < 0 ? "#dc2626" : '' }) },
      { headerName: "Spark", field: "spark", cellRenderer: SparklineRenderer, filter: false, width: 150, suppressAutoSize: true, sortable: false },
    ],
    []
  );
  const theme=themeQuartz.withPart(darkMode?colorSchemeDark:colorSchemeLight);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
      flex: 1,
      minWidth: 80,
    }),
    []
  );

  return (
    <div className={`min-h-screen w-full p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-6xl mx-auto">
        <div style={{ height: 520, width: "100%" }}>
          <AgGridReact
            theme={theme}
            rowData={rowData}
            columnDefs={cols}
            defaultColDef={defaultColDef}
            animateRows={true}
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            quickFilterText={filter}
          />
        </div>
      </div>
    </div>
  );
} 


function valueFormatter(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
