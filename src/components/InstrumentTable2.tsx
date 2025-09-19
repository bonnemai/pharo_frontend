import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import SparklineRenderer  from "./SparklineRenderer";
import "ag-grid-community/styles/ag-grid.css";
import { Instrument } from "../types/Instrument";

export default function InstrumentTable2({rowData, darkMode}: {rowData?: Instrument[], darkMode: boolean}) {
  const cols = useMemo<ColDef[]>(
    () => [
      { headerName: "Symbol", field: "symbol", pinned: "left", width: 140 },
      { headerName: "Price", field: "price", type: "rightAligned", width: 100 },
      { headerName: "P&L", field: "pnl", type: "rightAligned", width: 90,
        valueFormatter: p => (p.value >= 0 ? `+${p.value}` : `${p.value}`) },
      { headerName: "Spark", field: "spark", cellRenderer: SparklineRenderer, width: 150, suppressAutoSize: true },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 80,
    }),
    []
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="ag-theme-quartz" style={{ height: 520, width: "100%" }}>
          <AgGridReact
            chartThemes={[darkMode ? 'ag-pastel' : 'ag-default']}
            rowData={rowData}
            columnDefs={cols}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowSelection="single"
          />
        </div>
      </div>
    </div>
  );
}
