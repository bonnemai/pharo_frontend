import { useEffect, useState } from 'react';
import 'antd/dist/reset.css';
import './styles/App.css';
import { Radio } from 'antd';
import DarkModeToggle from './components/DarkModeToggle';
import instrumentData from './resources/instruments.json';
import InstrumentTable from './components/InstrumentTable';
import SearchBar from './components/SearchBar';
import { useDarkMode } from './hooks/useDarkMode';
import { Instrument, SparklineData } from './types/Instrument';
import { API_HOST } from './config/api';

type DataSource = 'json' | 'api';

const DATA_SOURCE_OPTIONS = [
  { label: 'Mock JSON', value: 'json' as const },
  { label: 'REST API (live)', value: 'api' as const },
];

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normaliseSparkline(value: unknown): SparklineData[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((point, index) => {
      if (point && typeof point === 'object') {
        const level = toNumber((point as Record<string, unknown>).level ?? (point as Record<string, unknown>).value);
        if (level === null) return null;
        const dateValue = (point as Record<string, unknown>).date;
        const date = typeof dateValue === 'string' ? dateValue : `${index}`;
        return { date, level };
      }
      return null;
    })
    .filter((p): p is SparklineData => Boolean(p));
}

function extractInstrumentCandidates(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.rows)) {
      return record.rows;
    }
    if (Array.isArray(record.data)) {
      return record.data;
    }
  }
  return payload === undefined || payload === null ? [] : [payload];
}

function normaliseInstruments(payload: unknown): Instrument[] {
  const source = extractInstrumentCandidates(payload);

  return source
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const symbol = typeof record.symbol === 'string' ? record.symbol : null;
      const price = toNumber(record.price);
      const pnl = toNumber(record.pnl);
      if (!symbol || price === null || pnl === null) return null;

      const rawSparkline = record.sparkline ?? record.spark ?? [];
      const sparkline = normaliseSparkline(rawSparkline);
      const idValue = toNumber(record.id);
      const id = idValue !== null ? idValue : index;

      return { id, symbol, price, pnl, sparkline } satisfies Instrument;
    })
    .filter((item): item is Instrument => Boolean(item));
}

function App() {
  const { isDarkMode, setDarkMode } = useDarkMode();
  const [filter, setFilter] = useState('');
  const [dataSource, setDataSource] = useState<DataSource>('json');
  const [tableData, setTableData] = useState<Instrument[]>(() => normaliseInstruments(instrumentData));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;
    const controller = new AbortController();

    const replaceData = (next: Instrument[]) => {
      if (!cancelled) {
        setTableData(next);
      }
    };

    const applyError = (message: string) => {
      if (!cancelled) {
        setError(message);
      }
    };

    const finishLoading = () => {
      if (!cancelled) {
        setLoading(false);
      }
    };

    if (dataSource === 'json') {
      setLoading(false);
      setError(null);
      replaceData(normaliseInstruments(instrumentData));
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError(null);

    if (dataSource === 'api') {
      const fetchData = async () => {
        try {
          const response = await fetch(`${API_HOST}/api/instruments`, {
            signal: controller.signal,
          });
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          const body = await response.json();
          replaceData(normaliseInstruments(body));
          finishLoading();
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          applyError('Unable to load instruments from API.');
          finishLoading();
        }
      };

      // Fetch immediately
      fetchData();

      // Then poll every second
      pollInterval = setInterval(() => {
        if (!cancelled) {
          fetchData();
        }
      }, 1000);
    }

    return () => {
      cancelled = true;
      controller.abort();
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [dataSource]);

  return (
    <div
      data-testid="app-root"
      className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <header className="app__toolbar">
        <h1>Dashboard</h1>
        <div className="app__controls">
          <DarkModeToggle darkMode={isDarkMode} onChange={setDarkMode} />
          <SearchBar onSearch={setFilter} darkMode={isDarkMode} />
          <Radio.Group
            className="app__data-source"
            options={DATA_SOURCE_OPTIONS}
            value={dataSource}
            optionType="button"
            onChange={event => setDataSource(event.target.value as DataSource)}
          />
        </div>
      </header>
      <main className="app__content">
        <div className="app__table-wrapper">
          {(loading || error) && (
            <div
              className={`app__status ${loading ? 'app__status--loading' : 'app__status--error'}`}
              role="status"
            >
              {loading ? 'Loading instruments…' : error}
            </div>
          )}
          <InstrumentTable
            rowData={tableData}
            darkMode={isDarkMode}
            filter={filter}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
