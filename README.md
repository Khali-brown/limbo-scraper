# Limbo Scrape

Limbo Scraper is a tool designed to simplify and enhance data fetching in JavaScript/TypeScript projects. It provides utilities for efficient API requests, error handling, and caching.

## Features

- Simplified API data fetching
- Automatic error handling
- Built-in caching mechanism
- TypeScript support
- Easy integration

## Installation

```bash
npm install Limbo Scrape
```

## Usage

```js
import { fetchData } from 'smart-fetch-scribe';

async function getUser() {
    const user = await fetchData('/api/user');
    console.log(user);
}
```

## API

- `fetchData(url, options)`: Fetches data from the given URL.
- `setCache(key, value)`: Stores data in cache.
- `getCache(key)`: Retrieves data from cache.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes
4. Push to the branch
5. Open a pull request
