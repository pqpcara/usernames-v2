# @17secrets/usernames

Check username availability across all platforms. Simple, fast and straightforward.

[![npm version](https://img.shields.io/npm/v/@17secrets/usernames)](https://www.npmjs.com/package/@17secrets/usernames)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What works

- ✅ Check username availability on 10+ platforms (Discord, Instagram, TikTok, YouTube, SoloTo, GitHub, Minecraft, Roblox, Xbox, Steam)
- ✅ Automatic alternative username suggestions with optional verification
- ✅ Proxy support with authentication and random selection
- ✅ TypeScript with full type definitions
- ✅ Lightweight with minimal dependencies (only undici)

## Installation

```bash
npm install @17secrets/usernames
```

## Quick Start

### TypeScript/ESM
```typescript
import { Client } from '@17secrets/usernames';

const client = new Client();

// Check a username
const result = await client.discord('myusername');
console.log(result);
```

### CommonJS with async/await
```javascript
const { Client } = require("@17secrets/usernames");

(async () => {
  const client = new Client();
  const data = await client.github("pqpcara");
  console.log(data);
})();
```

### CommonJS with .then()
```javascript
const { Client } = require("@17secrets/usernames");

const client = new Client();
client.github('pqpcara').then((info) => console.log(info));
```

## Response Format

All checker methods return a `Promise<IResponse>`:

```typescript
interface IResponse {
  platform: string;           // Platform name (e.g., "discord")
  username: string;           // Username checked
  available: boolean | null;  // true/false or null if error
  message: string;            // Descriptive status message
  error?: string | null;      // Error details if any
  suggestions?: string | null; // Comma-separated username suggestions
}
```

Example response:
```json
{
  "platform": "discord",
  "username": "myusername",
  "available": true,
  "message": "Username is valid",
  "error": null,
  "suggestions": null
}
```

## Supported Platforms

### Social Media
- **Discord** - Real-time availability checking via Discord API
- **Instagram** - Checks via Instagram Web API
- **TikTok** - Validates against TikTok's username format and availability
- **YouTube** - Checks YouTube channel availability
- **SoloTo** - Checks SoloTo platform availability

### Gaming Platforms
- **GitHub** - Checks GitHub user profiles with HTML parsing
- **Minecraft** - Checks Minecraft profiles via Mojang API
- **Roblox** - Validates Roblox usernames with CSRF token handling
- **Xbox** - Checks Xbox gamertag availability
- **Steam** - Checks Steam profile availability

## Usage Examples

### Check Single Platform
```typescript
const client = new Client();

// Discord
const discordResult = await client.discord("your_username");
console.log(discordResult);

// Roblox
const robloxResult = await client.roblox("your_username");
console.log(robloxResult);

// Minecraft
const minecraftResult = await client.minecraft("your_username");
console.log(minecraftResult);

// GitHub
const githubResult = await client.github("pqpcara");
console.log(githubResult);

// Instagram
const instagramResult = await client.instagram("your_username");
console.log(instagramResult);

// TikTok
const tiktokResult = await client.tiktok("your_username");
console.log(tiktokResult);

// YouTube
const youtubeResult = await client.youtube("your_username");
console.log(youtubeResult);

// Xbox
const xboxResult = await client.xbox("your_username");
console.log(xboxResult);

// Steam
const steamResult = await client.steam("your_username");
console.log(steamResult);

// SoloTo
const solotoResult = await client.soloto("your_username");
console.log(solotoResult);
```

### With Username Suggestions

Enable automatic username suggestions when a username is taken:

```typescript
const client = new Client({
  suggestions: {
    enabled: true,
    amount: 5,
    verification: true  // Verify suggestions are actually available
  }
});

const result = await client.discord('taken_username');
console.log(result.suggestions); // "taken_username1, taken_username2, ..."
```

**Options:**
- `enabled` - Enable suggestions (default: false)
- `amount` - Number of suggestions to generate (default: 1)
- `verification` - Verify if suggestions are available (default: false, slower but accurate)

### With Proxies

Use proxies for all requests with automatic random selection:

```typescript
const client = new Client();

// Add proxies
client.proxy.proxies
  .add({ host: 'proxy1.com', port: 8080 })
  .add({ host: 'proxy2.com', port: 8081, username: 'user', password: 'pass' });

// Enable proxy usage
client.proxy.enabled(true);

// Now requests use a random proxy from the list
const result = await client.roblox('username');
```

**Proxy Management:**

```typescript
// Add multiple proxies
client.proxy.proxies
  .add({ host: 'proxy1.com', port: 8080 })
  .add({ host: 'proxy2.com', port: 8081 });

// Check proxy count
console.log(client.proxy.proxies.size); // 2

// List all proxies
console.log(client.proxy.proxies.list());

// Clear all proxies
client.proxy.proxies.clear();

// Check if proxies are enabled
console.log(client.proxy.enabled()); // true/false

// Toggle proxy usage
client.proxy.enabled(false);
```

## Complete Example

```typescript
import { Client } from '@17secrets/usernames';

const client = new Client({
  suggestions: {
    enabled: true,
    amount: 3,
    verification: true
  }
});

// Add proxies
client.proxy.proxies
  .add({ host: 'proxy1.com', port: 8080 })
  .add({ host: 'proxy2.com', port: 8081 });

client.proxy.enabled(true);

// Check username
const result = await client.roblox('my_username');

if (result.available) {
  console.log('✅ Username available!');
} else {
  console.log('❌ Username unavailable');
  if (result.suggestions) {
    console.log('💡 Try:', result.suggestions);
  }
}
```

## License

MIT © 2026

## Links

- [GitHub](https://github.com/pqpcara/usernames-v2)
- [NPM](https://www.npmjs.com/package/@17secrets/usernames)
