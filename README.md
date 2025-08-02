# GW2 Inventory

A Guild Wars 2 inventory management web application built with React, TypeScript, and Vite.

## Features

- View and manage character inventories
- Track items across all characters
- Filter items by category
- Search functionality
- API token management

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/etblue/gw2inventory.git
cd gw2inventory

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `build` directory.

### Type Checking

```bash
# Run TypeScript type checking
npm run typecheck
```

## Configuration

### API Token

To use this application, you'll need a Guild Wars 2 API token:

1. Go to [https://account.arena.net/applications](https://account.arena.net/applications)
2. Create a new API key with the necessary permissions
3. Add the token in the application's Settings page

## Deployment

This application is deployed to GitHub Pages at [https://etblue.github.io/gw2inventory](https://etblue.github.io/gw2inventory)

### Technologies Used

- React 19
- TypeScript 5
- Vite 7
- Chakra UI v2
- React Router v7
- Tanstack React Query (formerly React Query)
- Emotion (styling)
- Framer Motion (animations)
- Lodash
- date-fns
- React Icons

## Known Issues

The following item IDs return 404 from the GW2 API:
- 24120
- 24151
- 81662
- 24427
- 82367
- 24434
- 87149
- 81324

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.