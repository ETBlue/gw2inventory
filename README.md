# GW2 Inventory

A web frontend application built for Guild Wars 2 players pursuing ultimate cross-character management.

To use this application, you'll need a Guild Wars 2 API token:

1. Go to [https://account.arena.net/applications](https://account.arena.net/applications) and log in with your Guild Wars 2 account
2. Create a new API key with the following permissions: **account**, **characters**, **inventories**, **unlocks**, **wallet**, **progression**, **guilds**
3. Add the token in the application's Settings page

## Features

### Account

Account overview with expansion access, WvW rank, fractal level, guilds, and titles. Sub-pages for wallet, outfits, gliders, mail carriers, mounts, home, and masteries.

![Account](docs/screenshots/2026-02-01/account%20overview%20-%20Guild%20Wars%202%20Inventory.png)

### Characters

Browse all characters with profession, race, level, crafting disciplines, and age. Filter by profession. Expand any character to see backstory, specializations, and equipped builds.

![Characters](docs/screenshots/2026-02-01/characters%20-%20Guild%20Wars%202%20Inventory.png)

![Character details expanded](docs/screenshots/2026-02-01/characters%20details%20expanded%20-%20Guild%20Wars%202%20Inventory.png)

### Items

View items across all characters with category filtering (equipable, consumable, material, trophy), pagination, and search.

![Items](docs/screenshots/2026-02-01/items%20all%20-%20Guild%20Wars%202%20Inventory.png)

### Skins

Browse unlocked skins filtered by type (armor, weapon, gathering, back) with rarity and restriction details.

![Skins](docs/screenshots/2026-02-01/skins%20all%20-%20Guild%20Wars%202%20Inventory.png)

### Dyes

View unlocked dyes with color swatches across cloth, leather, metal, and fur materials. Filter by hue.

![Dyes](docs/screenshots/2026-02-01/dyes%20-%20Guild%20Wars%202%20Inventory.png)

### Settings

Manage multiple API tokens with secure local storage. Switch between accounts from the header.

![Settings](docs/screenshots/2026-02-01/settings%20-%20Guild%20Wars%202%20Inventory.png)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- A Guild Wars 2 account

## Getting Started

```bash
git clone https://github.com/etblue/gw2inventory.git
cd gw2inventory
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

For all development commands, tech stack, and project architecture, see [CLAUDE.md](CLAUDE.md).

## Deployment

This application is deployed to GitHub Pages at [https://etblue.github.io/gw2inventory](https://etblue.github.io/gw2inventory)

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
