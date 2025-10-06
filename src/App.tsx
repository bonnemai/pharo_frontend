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

type DataSource = 'json' | 'api' | 'sse';

const DATA_SOURCE_OPTIONS = [
  { label: 'Mock JSON', value: 'json' as const },
  { label: 'REST API', value: 'api' as const },
  { label: 'Realtime SSE', value: 'sse' as const },
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

function mergeInstrumentRows(current: Instrument[], updates: Instrument[]): Instrument[] {
  if (updates.length === 0) return current;
  const map = new Map<number, Instrument>();
  current.forEach(entry => {
    map.set(entry.id, entry);
  });
  updates.forEach(entry => {
    map.set(entry.id, entry);
  });
  return Array.from(map.values());
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
    let eventSource: EventSource | null = null;
    let hasReceivedRealtimeData = false;
    let reconnectInterval: ReturnType<typeof setInterval> | null = null;
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
      (async () => {
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
      })();
    }

    if (dataSource === 'sse') {
      if (typeof EventSource === 'undefined') {
        applyError('Server Sent Events are not supported in this environment.');
        finishLoading();
      } else {
        const connectSSE = () => {
          if (eventSource) {
            eventSource.close();
          }

          eventSource = new EventSource(`${API_HOST}/api/instruments/realtime`);
          const handlePayload = (event: MessageEvent) => {
            try {
              const payload = JSON.parse(event.data);
              const updates = normaliseInstruments(payload);
              if (updates.length > 0) {
                setTableData(prev => mergeInstrumentRows(prev, updates));
                hasReceivedRealtimeData = true;
                setError(null);
                setLoading(false);
              }
            } catch {
              applyError('Received malformed realtime payload.');
              finishLoading();
            }
          };

          eventSource.addEventListener('upsert', handlePayload);
          eventSource.onmessage = handlePayload;
          eventSource.addEventListener('ping', () => {
            if (!cancelled && hasReceivedRealtimeData) {
              setError(null);
            }
          });
          eventSource.onerror = () => {
            applyError('Realtime connection interrupted.');
            finishLoading();
            if (eventSource) {
              eventSource.close();
            }
          };
        };

        connectSSE();

        // Reconnect every 20 seconds
        reconnectInterval = setInterval(() => {
          if (!cancelled) {
            connectSSE();
          }
        }, 20000);
      }
    }

    return () => {
      cancelled = true;
      controller.abort();
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
    };
  }, [dataSource]);

  const isRealtime = dataSource === 'sse';

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
              {loading ? (isRealtime ? 'Listening for realtime data…' : 'Loading instruments…') : error}
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
