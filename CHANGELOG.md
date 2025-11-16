# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial Next.js 16 project setup with React 19
- shadcn/ui component library integration
  - Configured with New York style and neutral base color
  - Added Button and Card components as examples
  - Full TypeScript support with path aliases
  - Dark mode support with CSS custom properties
- Docker containerization support
  - Multi-stage Dockerfile optimized for Next.js standalone output
  - Docker Compose configuration for easy deployment
  - Docker helper scripts in package.json
- Prettier code formatting configuration
  - Tailwind CSS class sorting plugin
  - Project-wide formatting rules
  - Format and format:check scripts

### Changed

- Updated Next.js config to enable standalone output mode for Docker optimization

### Infrastructure

- Tailwind CSS v4 with PostCSS integration
- TypeScript strict mode enabled
- ESLint v9 with Next.js recommended configuration
- pnpm as package manager
