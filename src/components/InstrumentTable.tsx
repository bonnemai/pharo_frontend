import { Table } from 'antd';
import { Instrument } from '../types/Instrument';

interface InstrumentTableProps {
  instruments: Instrument[];
  isDarkMode?: boolean;
}

function getColumns(isDarkMode?: boolean) {
  return [
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
          sorter: (a: Instrument, b: Instrument) => a.symbol.localeCompare(b.symbol),
    filterSearch: true,
    filters: [],
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    sorter: (a: Instrument, b: Instrument) => a.price - b.price,
    render: (price: number) => price.toFixed(2),
  },
  {
    title: 'P&L',
    dataIndex: 'pnl',
    key: 'pnl',
    sorter: (a: Instrument, b: Instrument) => a.pnl - b.pnl,
    render: (pnl: number) => pnl.toFixed(2),
  },
  {
    title: 'Trend',
    dataIndex: 'sparkline',
    key: 'sparkline',
  },
];
}

// Not used.
export default function InstrumentTable({ instruments, isDarkMode }: InstrumentTableProps) {
  
  console.log('Rendering InstrumentTable with instruments:', instruments.length);
  return (
    <Table
      dataSource={instruments}
      columns={getColumns(isDarkMode)}
      rowKey="symbol"
      pagination={false}
      scroll={{ x: true }}
    />)
};
