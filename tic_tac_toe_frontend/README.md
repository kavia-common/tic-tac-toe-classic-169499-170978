# Tic Tac Toe Frontend (React) — Ocean Professional Theme

A modern, accessible, two-player Tic Tac Toe built with React and vanilla CSS. No backend required.

## Quick Start

In the `tic_tac_toe_frontend` directory:

- Install: `npm install`
- Run dev server: `npm start`
- Build for production: `npm run build`
- Tests: `npm test`

The app runs at http://localhost:3000.

## Features

- 3x3 board with keyboard operable squares and ARIA labels
- Turn indicator, win/draw detection, and winner highlight
- Prevents moves after game end
- New Game (reset) button
- Optional move history with jump to move
- Responsive, smooth transitions, rounded corners, subtle shadows
- Ocean Professional colors:
  - Primary: #2563EB
  - Secondary/Success: #F59E0B
  - Error: #EF4444
  - Background: #f9fafb
  - Surface: #ffffff
  - Text: #111827

## Environment

The app is fully client-side. Existing REACT_APP_* env vars are respected but not required.

## Accessibility

- Squares are buttons with aria-labels and visible focus rings
- Live status updates via role="status" region
