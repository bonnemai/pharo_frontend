import { Instrument } from "../types/Instrument";

export const fetchPortfolioData = async (): Promise<Instrument[]> => {
    const response = await fetch('/path/to/mock/portfolio.json');
    if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
    }
    const data: Instrument[] = await response.json();
    return data;
};

export const sortInstruments = (instruments: Instrument[], key: keyof Instrument, ascending: boolean = true): Instrument[] => {
    return instruments.sort((a, b) => {
        if (a[key] < b[key]) return ascending ? -1 : 1;
        if (a[key] > b[key]) return ascending ? 1 : -1;
        return 0;
    });
};

export const filterInstruments = (instruments: Instrument[], searchTerm: string): Instrument[] => {
    return instruments.filter(instrument => 
        instrument.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
};