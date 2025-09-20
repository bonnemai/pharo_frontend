# Mini Dashboard Application

Build a mini-dashboard application for portfolio monitoring with the following requirements:
*	Use React + TypeScript.
*	Display a list of financial instruments (mock JSON dataset provided).
*	Each instrument should show: symbol, price, P&L, and a small trend sparkline.
*	Allow sorting, filtering, and searching by symbol.
*	Implement responsive UI for desktop and mobile.
*	Add a dark mode toggle.

## Features

- **Portfolio Monitoring**: View a list of financial instruments with real-time data.
- **Sorting and Filtering**: Easily sort and filter instruments based on various criteria.
- **Search Functionality**: Search for instruments by symbol.
- **Responsive Design**: The application is designed to work on various screen sizes.
- **Dark Mode Toggle**: Switch between light and dark themes for better usability.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation
   ```
   npm install
   ```

### Running the Application

To start the application in development mode, run:

```
npm run dev
```

The Vite development server runs on http://localhost:5173 by default. Use `npm start` (mapped to `vite dev --host 0.0.0.0 --port 3000`) when developing inside Docker or when the server must bind to all interfaces.

### Running Tests

- `npm test` starts Vitest in watch mode.
- `npm run test:run` runs the test suite once (used by the Docker build).
- `npm run test:e2e` executes the Playwright end-to-end suite (run `npx playwright install` once to download browsers).
- `npm run test:e2e:ui` opens the interactive Playwright UI for development and debugging.

### Building for Production

To create a production build of the application, run:

```
npm run build
```

This will generate a `dist` folder with the optimized production files.

### Previewing the Production Build

```
npm run preview
```

This serves the production build locally so you can validate the output.

### TODO
* Add linting and formatting rules
* Why do we have duplicate tickers?
* Connect to the Backend?
