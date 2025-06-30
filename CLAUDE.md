# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Remap is a keyboard customization web application that enables users to find, configure, and customize self-made keyboard kits. The application communicates directly with keyboards via WebHID API and supports QMK Firmware-based keyboards.

## Development Commands

### Essential Commands

```bash
# Install dependencies
yarn install

# Start development server (localhost:3000)
yarn start

# Type checking
yarn type-check

# Linting
yarn lint

# Build production
yarn build

# Run tests
yarn test

# Format code (required before commit)
yarn format
```

### Single Test Execution

```bash
# Run specific test file
yarn test KeyModel.test.ts

# Run tests with watch mode
yarn test --watch
```

## Architecture Overview

### Application Structure

- **Architecture Pattern**: Layered architecture with domain-driven design
- **State Management**: Redux with Immer for immutability
- **Build Tool**: Vite with TypeScript and React
- **Testing**: Vitest with happy-dom environment

### Key Domain Boundaries

1. **Configure Domain**: Keyboard connection and keymap editing
2. **Catalog Domain**: Public keyboard search and shared keymap management
3. **Keyboards Domain**: Keyboard definition creation and review process
4. **Workbench Domain**: QMK firmware building and customization

### Service Layer Organization

- **HID Service**: WebHID API integration for keyboard communication
- **Storage Service**: Firebase Firestore for data persistence
- **Auth Service**: Firebase Authentication
- **Firmware Service**: Multi-bootloader firmware flashing (Caterina, DFU)
- **LabelLang Service**: 60+ language/layout support for keyboards

### State Management Patterns

```typescript
// Service instance injection pattern
RootState = {
  entities: { device, keyboards, keyboardDefinition },
  app: { setupPhase, remaps, notifications },
  configure: { keymap, keycodes, keydiff },
  catalog: {
    /* catalog state */
  },
  keyboards: {
    /* keyboard management state */
  },
  // Service instances
  hid: { instance },
  storage: { instance },
};
```

## Development Guidelines

### Code Organization

- Use Container/Presentational component pattern
- Services are injected as instances in Redux state
- Async operations use Redux Thunk pattern
- Complex keycodes managed via Composition pattern

### Keyboard-Specific Concepts

- **Setup Phases**: Application follows strict setup flow (`init` → `connectingKeyboard` → `openedKeyboard`)
- **Keycode Compositions**: QMK keycodes (Basic, Layer, Macro) handled via composition classes
- **HID Communication**: Real-time bidirectional communication with connected keyboards
- **Layout Options**: Physical keyboard layout variations and customization
- **Macro System**: Complex macro definitions with timing and key sequences

### WebHID Integration

- Browser compatibility: Chrome/Edge 89+ required
- Device connection managed through setupPhase state
- Real-time keymap updates reflected immediately on physical hardware
- Multiple keyboard support with device enumeration

### Internationalization

- i18next with Japanese and English support
- Language-specific key labels and layouts
- RTL language support for Hebrew, Arabic layouts

### Testing Limitations

- Local development cannot access Firebase backend
- Keyboard definition files must be imported manually during local testing
- WebHID API requires HTTPS in production

### Firebase Integration

- Firestore for keyboard definitions and user data
- Firebase Auth for user management
- Storage for firmware files and assets
- Security rules defined in `firestore.rules`

### Firmware Development

- QMK Firmware integration via GitHub
- PayPal integration for premium build services
- Multi-stage build process with validation
- Support for custom firmware modifications

## Code Quality Requirements

### Pre-commit Process

1. Run `yarn format` (enforced by husky pre-commit hook)
2. Ensure `yarn type-check` passes
3. Ensure `yarn lint` passes without errors
4. Verify `yarn test` passes for affected components

### TypeScript Guidelines

- Strict mode enabled with comprehensive type checking
- Web API type definitions included (@types/w3c-web-hid, @types/w3c-web-usb)
- Prefer interface definitions for component props
- Use proper typing for Redux actions and state

### Styling Conventions

- SCSS modules for component-specific styles
- Material-UI (MUI) components for UI consistency
- Responsive design with mobile-first approach
- CSS-in-JS with TSS-React for dynamic styling

## Hardware Integration Notes

### Supported Bootloaders

- Caterina (Arduino-compatible)
- AtmelDFU
- Custom bootloader implementations

### Communication Protocols

- Raw HID for keymap communication
- USB/Serial for firmware flashing
- WebSerial API for bootloader communication

### Key Matrix Handling

- Physical key position mapping
- Layer management (up to 32 layers)
- Rotary encoder support
- LED lighting configuration

## Community & Ecosystem

### Keyboard Definition Process

1. Community submission via GitHub
2. Technical review and validation
3. JSON schema compliance verification
4. Integration into public catalog

### Shared Keymap System

- Public keymap sharing and discovery
- Community rating and feedback
- Export/import functionality across different keyboards

This codebase requires understanding of mechanical keyboard concepts, QMK firmware architecture, and hardware communication protocols for effective development.
