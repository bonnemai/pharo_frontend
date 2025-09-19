export interface SparklineData {
    date: string; // ISO date string
    level: number;
}

export interface Instrument {
    id: number;
    symbol: string;
    price: number;
    pnl: number;
    sparkline: SparklineData[]; // Array of price points for sparkline
    // change: number; // Change in price
    // percentageChange: number; // Percentage change
    // volume: number; // Trading volume
    // marketCap: number; // Market capitalization
}