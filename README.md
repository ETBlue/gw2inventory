# GW2 Inventory

Track everything across your Guild Wars 2 account in one place — characters, items, skins, dyes, wallet, and more.

Try it at [etblue.github.io/gw2inventory](https://etblue.github.io/gw2inventory).

## Features

### Account

See your account at a glance — expansion access, WvW rank, fractal level, guilds, and titles. Drill into wallet, outfits, gliders, mail carriers, mounts, home, and masteries.

![Account](docs/screenshots/2026-02-01/account%20overview%20-%20Guild%20Wars%202%20Inventory.png)

### Characters

Sort and filter your roster by profession. Expand any character to inspect backstory, specializations, and equipped builds.

![Characters](docs/screenshots/2026-02-01/characters%20-%20Guild%20Wars%202%20Inventory.png)

![Character details expanded](docs/screenshots/2026-02-01/characters%20details%20expanded%20-%20Guild%20Wars%202%20Inventory.png)

### Items

Search and filter items across all characters by category — equipable, consumable, material, or trophy.

![Items](docs/screenshots/2026-02-01/items%20all%20-%20Guild%20Wars%202%20Inventory.png)

### Skins

Browse your unlocked skins by type and slot, with rarity and race restriction details.

![Skins](docs/screenshots/2026-02-01/skins%20all%20-%20Guild%20Wars%202%20Inventory.png)

### Dyes

View your unlocked dyes with color swatches for cloth, leather, metal, and fur. Filter by hue to find what you're looking for.

![Dyes](docs/screenshots/2026-02-01/dyes%20-%20Guild%20Wars%202%20Inventory.png)

## Setup

To use this app, you need a Guild Wars 2 API token:

1. Go to [Arena.net API Key Management](https://account.arena.net/applications) and log in
2. Create a new API key with these permissions: **account**, **characters**, **inventories**, **unlocks**, **wallet**, **progression**, **guilds**
3. Paste the token on the app's Settings page

### Running locally

Requires Node.js v18+ and npm.

```bash
git clone https://github.com/etblue/gw2inventory.git
cd gw2inventory
npm install
npm run dev
```

The app will be available at [localhost:3000](http://localhost:3000). For development commands and architecture details, see [CLAUDE.md](CLAUDE.md).

## Contributing

Feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
