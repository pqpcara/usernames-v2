# @17secrets/usernames

> Library for checking usernames using or not using proxies in Node.js

[![npm version](https://img.shields.io/npm/v/@17secrets/usernames)](https://www.npmjs.com/package/@17secrets/usernames)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

A statically typed library for verifying usernames using or not using a proxy. Developed with TypeScript, with no dependencies and production-ready.

## Installation

```bash
npm install @17secrets/usernames
```

## Quick Start

```typescript
import { Client } from '@17secrets/usernames';

const client = new Client();

// Enable proxies
client.proxy.enabled(true);

// Add proxies
client.proxy.proxies
  .add({ host: 'proxy.example.com', port: 8080 })
  .add({ host: 'proxy2.example.com', port: 8081, username: 'user', password: 'pass' });

// List all proxies
console.log(client.proxy.proxies.list());
```

## Basic Usage

### Initialize Client

```typescript
import { Client } from '@17secrets/usernames';

const client = new Client();
```

### Manage Proxies

```typescript
// Enable/disable proxies
client.proxy.enabled(true);

// Add a proxy
client.proxy.proxies.add({
  host: 'proxy.example.com',
  port: 8080,
  username: 'user',
  password: 'pass'
});

// Add multiple proxies
client.proxy.proxies
  .add({ host: 'proxy1.com', port: 8080 })
  .add({ host: 'proxy2.com', port: 8081 });

// List all proxies
const proxies = client.proxy.proxies.list();

// Get proxy count
console.log(client.proxy.proxies.size);

// Clear all proxies
client.proxy.proxies.clear();
```

## Links

- [GitHub](https://github.com/pqpcara/usernames-v2)
- [NPM](https://www.npmjs.com/package/@17secrets/usernames)
