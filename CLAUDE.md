# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Remap is a keyboard customization web application that enables users to find, configure, and customize self-made keyboard kits. The application communicates directly with keyboards via WebHID API (Chrome/Edge 89+) and supports QMK Firmware-based keyboards. Production site: https://remap-keys.app

## Development Commands

```bash
npm install               # Install dependencies
npm start                 # Dev server at localhost:3000
npm run type-check        # TypeScript checking (tsc --noEmit)
npm run lint              # ESLint on src/
npm run build             # type-check + lint + vite build
npm test -- --run         # Run all tests once
npm test -- KeyModel.test.ts --run  # Run a specific test file
npm run format            # Prettier on src/**/*.{ts,tsx} (husky pre-commit runs this)
npm run gen-types         # Regenerate TypeScript types from keyboard-definition-schema.json
```

**Note:** Vite root is `src/` (not project root). Build output goes to `build/`. Test files live alongside source files as `*.test.ts`.

## Architecture

### Layered Architecture

```
UI Layer        → src/components/  (React + MUI + SCSS/TSS-React)
Redux Layer     → src/actions/ + src/store/  (Redux + Immer + Thunk)
Service Layer   → src/services/  (HID, Storage, Auth, Firmware, etc.)
External APIs   → WebHID, Firebase, GitHub API, PayPal
```

### Domain Boundaries (Routes in App.tsx)

| Route            | Domain        | Purpose                                 |
| ---------------- | ------------- | --------------------------------------- |
| `/configure`     | Configure     | Keyboard connection + keymap editing    |
| `/catalog`       | Catalog       | Public keyboard search + shared keymaps |
| `/keyboards`     | Keyboards     | Keyboard definition creation + review   |
| `/workbench`     | Workbench     | QMK firmware building                   |
| `/organizations` | Organizations | Organization management                 |

### Container/Presentational Pattern

Every connected component follows this structure (65+ containers):

- `Foo.container.ts` — `connect(mapStateToProps, mapDispatchToProps)(Foo)`, Redux wiring only
- `Foo.tsx` — Pure presentational component receiving props

Containers live alongside their presentational components. When modifying Redux-connected behavior, edit the `.container.ts` file. When modifying UI/rendering, edit the `.tsx` file.

### Redux Store Structure

```typescript
RootState = {
  entities: { device, keyboards, keyboardDefinition, keyboardDefinitionDocuments,
              savedKeymaps, sharedKeymaps, appliedKeymaps, ... },
  app:      { setupPhase, remaps, encodersRemaps, notifications, labelLang,
              signedIn, meta, user, package, buildNumber, ... },
  configure: { header, keymap, keycodes, keycodeKey, keydiff,
               layoutOptions, macroEditor, practice, typingStats },
  catalog: { ... },
  keyboards: { ... },
  organizations: { ... },
  common: { ... },
  // Service instances injected into Redux state
  hid: { instance },       // IHid - WebHID wrapper
  storage: { instance },   // IStorage - Firebase Firestore
  auth: { instance },      // IAuth - Firebase Auth
  github: { instance },    // IGitHub - GitHub API
}
```

**Service Injection Pattern:** Service instances (HID, Storage, Auth, GitHub) are stored in Redux state and accessed via `mapStateToProps` in containers. Async operations dispatch thunks that call these service instances.

### Phase-Based State Management

Each domain uses phase enums to control UI flow:

- Configure: `ISetupPhase` = `'init'` → `'connectingKeyboard'` → `'openedKeyboard'`
- Keyboards: `KeyboardsPhase` for definition management flow
- Catalog: `ICatalogPhase` for browsing/search flow

### HID Composition Pattern

QMK keycodes are handled via the Composition pattern in `src/services/hid/compositions/`:

```
IComposition (interface: getCode(), genKeymap())
├── BasicComposition       (A-Z, 0-9, F-keys)
├── ModsComposition        (Ctrl/Shift/Alt modifiers)
├── ModTapComposition      (modifier + tap key)
├── LayerTapComposition    (layer switch + tap key)
├── MomentaryComposition   (momentary layer)
├── MacroComposition       (macro ID reference)
├── SwapHandsComposition   (hand swap)
└── ... (19+ composition types)
```

A factory in `Composition.ts` maps raw keycode numbers to the appropriate Composition class. Each composition knows how to encode/decode between numeric QMK keycodes and the `IKeymap` interface used by the UI.

### Key Services

| Service   | Location              | Interface         | Purpose                                     |
| --------- | --------------------- | ----------------- | ------------------------------------------- |
| HID       | `services/hid/`       | `IHid`            | WebHID API, VIA protocol, keymap read/write |
| Storage   | `services/storage/`   | `IStorage`        | Firebase Firestore CRUD                     |
| Auth      | `services/auth/`      | `IAuth`           | Firebase Auth (GitHub/Google OAuth)         |
| Firmware  | `services/firmware/`  | `IFirmwareWriter` | Bootloader flashing (Caterina, DFU)         |
| LabelLang | `services/labellang/` | KeyLabel          | 60+ keyboard language/layout labels         |
| Macro     | `services/macro/`     | IMacro            | Macro buffer management                     |
| Workbench | `services/workbench/` | FileGenerator     | QMK C/JSON code generation                  |
| Practice  | `services/practice/`  | PracticeTexts     | Typing practice texts                       |

### Key Models

- `models/KeyModel.ts` — Physical key position, size, rotation on keyboard layout
- `models/KeyboardModel.ts` — KLE format parsing, `KeymapItem` for keymap entries

### Internationalization

- i18next with Japanese and English (`src/assets/locales/`)
- 60+ keyboard-specific language labels via LabelLang service

## Important Constraints

- **Local dev cannot access Firebase backend** — keyboard definition JSON files must be imported manually
- **WebHID requires HTTPS in production**
- **Styling:** SCSS modules for component styles, MUI for UI components, TSS-React for dynamic CSS-in-JS
- **Firestore security rules** defined in `firestore.rules`
- **Generated types** in `src/gen/types/` — regenerate with `npm run gen-types` after schema changes
