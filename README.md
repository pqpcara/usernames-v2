# @17secrets/usernames

Check username availability across platforms. Simple, fast and straightforward.

[![npm version](https://img.shields.io/npm/v/@17secrets/usernames)](https://www.npmjs.com/package/@17secrets/usernames)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What works

- ✅ Check username availability on Roblox
- ✅ Automatic alternative username suggestions
- ✅ Proxy support (with authentication)
- ✅ TypeScript with full types
- ✅ No heavy dependencies

## Installation

```bash
npm install @17secrets/usernames
```

## Quick Start

```typescript
import { Client } from '@17secrets/usernames';

const client = new Client();

// Check a username
const result = await client.roblox('your_username');
console.log(result);
```

Result:
```json
{
  "platform": "roblox",
  "username": "your_username",
  "available": true,
  "message": "Username is valid",
  "error": null,
  "suggestions": null
}
```

## Supported Platforms
Check username availability on both Roblox, Minecraft and Github with simple calls:
```ts
// Check a Roblox username
const robloxResult = await client.roblox("your_username");
console.log(robloxResult);

// Check a Minecraft username
const minecraftResult = await client.minecraft("your_username");
console.log(minecraftResult);

// Check a Github username
const githubResult = await client.github("your_username");
console.log(githubResult);
```

## With Suggestions

Want alternative username suggestions? Enable it in the config:

```typescript
const client = new Client({
  suggestions: {
    enabled: true,
    amount: 5,
    verification: true
  }
});

const result = await client.roblox('unavailable_username');
console.log(result.suggestions); // "unavailable_username1, unavailable_username2, ..."
```

**Options:**
- `enabled` - Enable suggestions (default: false)
- `amount` - How many suggestions to generate (default: 1)
- `verification` - Verify if suggestions are available (default: false)

## With Proxies

Want to use proxies? Simple:

```typescript
const client = new Client();

// Add a proxy
client.proxy.proxies.add({
  host: 'proxy.example.com',
  port: 8080,
  username: 'user',
  password: 'pass'
});

// Enable proxies
client.proxy.enabled(true);

// Now requests use a random proxy
const result = await client.roblox('username');
```

**Manage proxies:**

```typescript
// Add multiple
client.proxy.proxies
  .add({ host: 'proxy1.com', port: 8080 })
  .add({ host: 'proxy2.com', port: 8081 });

// See how many
console.log(client.proxy.proxies.size); // 2

// List all
console.log(client.proxy.proxies.list());

// Clear all
client.proxy.proxies.clear();
```

## Full Response

```typescript
interface IRoblox {
  platform: string;        // "roblox"
  username: string;        // The username you checked
  available: boolean|null; // true/false or null if error
  message: string;         // Descriptive message
  error?: string|null;     // Error if any
  suggestions?: string;    // Suggestions separated by comma
}
```

**Possible messages:**
- `Username is valid` - Username available
- `Username is already in use` - Already taken
- `Username not appropriate for Roblox` - Not allowed
- `Usernames can be 3 to 20 characters long` - Invalid length

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

- [GitHub](https://github.com/pqpcara/usernames-v2projeto)
- [NPM](https://www.npmjs.com/package/@17secrets/usernames)
