# Cloudflare Reverse Proxy

A Cloudflare Worker-based reverse proxy service that handles domain mapping and request transformation for multiple domains.

## Overview

This service provides a secure way to proxy requests between public domains and their corresponding target destinations, with built-in security headers, content transformation, and canonical URL management.

## Features

- Domain-based request routing
- Security header management
- HTML content transformation
- Canonical URL handling
- Referrer policy enforcement
- Content Security Policy implementation

## Development

### Prerequisites

- Cloudflare Workers account
- Bun package manager

### Setup

1. Clone the repository
2. Install dependencies: `bun install`
3. Configure your domains in `wrangler.toml`

### Available Commands

- `bun run dev`: Start development server
- `bun run deploy`: Deploy to Cloudflare Workers
- `bun run test`: Run test suite
- `bun run cf-typegen`: Generate TypeScript types

## Security

This proxy implements several security measures:
- Content Security Policy
- X-Frame-Options
- Referrer Policy
- Mixed Content Blocking

## License

MIT License - See LICENSE file for details

## Contributing

Please read CODEOWNERS file for maintainer information and follow standard GitHub flow for contributions. 