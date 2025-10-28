# Project Overview

This project, "Remap," is a web-based application designed for customizing self-made keyboards. It allows users to find, configure, and customize their keyboards directly from a web browser. The application is built with React and TypeScript, utilizing the WebHID API to communicate with keyboards that run on QMK Firmware.

# Directory Structure

- `public/`: Contains the static assets that are publicly served.
- `src/`: This is where the main source code of the application resides.
  - `actions/`: Holds the Redux action creators.
  - `assets/`: Contains static assets like images, keymap definitions, and localization files.
  - `components/`: Includes all the React components that make up the UI.
  - `models/`: Defines the data models used throughout the application.
  - `services/`: Manages communication with external APIs and handles business logic.
  - `store/`: Contains the Redux store configuration, including reducers and initial state.
  - `utils/`: A collection of reusable utility functions.

# Architecture

This project follows a standard React/Redux architecture with a unidirectional data flow.

- **UI Framework:** React is used for building the user interface.
- **State Management:** Redux is employed for centralized state management, with Redux Thunk middleware for handling asynchronous actions.
- **Routing:** React Router manages the application's routing, directing users to different components based on the URL.
- **Component Library:** Material-UI provides a set of pre-built, customizable React components.
- **Immutability:** The `immer` library is used within Redux reducers to simplify immutable state updates.
- **Internationalization:** `i18next` is integrated for multi-language support.
- **Notifications:** `notistack` is used to display snackbar notifications.
- **Payments:** The application integrates with PayPal for payment processing using `@paypal/react-paypal-js`.

# API Integration

The application relies on several external and browser APIs to provide its features:

- **Firebase:** Used as the primary backend service.

  - **Authentication:** Manages user sign-in with GitHub and Google.
  - **Firestore:** Stores all major application data, including keyboard definitions, user keymaps, and organization details.
  - **Cloud Storage:** Handles storage for firmware files and keyboard catalog images.
  - **Cloud Functions:** Executes backend logic for tasks like creating firmware builds and managing organization members.

- **GitHub API:** Used to fetch user account information from GitHub.

- **WebHID API:** Enables direct communication between the browser and connected keyboard hardware, which is a core feature of the application.

# Deployment Flow

This project uses GitHub Actions for its CI/CD pipeline.

- **Pull Requests:** When a pull request is opened or updated, a workflow is triggered to build the application and run tests (`yarn build && yarn test`). This ensures that all changes are verified before being merged into the `main` branch.

- **Production Deployment:** When changes are pushed to the `main` branch, a separate workflow is triggered:
  1.  The build number in `src/assets/files/build-info.json` is automatically incremented and committed.
  2.  The application is built and tests are run.
  3.  If the build and tests are successful, the application is automatically deployed to Firebase Hosting.

# Testing Strategy

The project uses `vitest` as its primary testing framework.

- **Unit Tests:** The testing strategy heavily emphasizes unit tests. There is extensive test coverage for business logic (`services`), data models (`models`), and utility functions (`utils`). The complex logic for keycode compositions in `src/services/hid/compositions` is particularly well-tested.

- **Integration Tests:** Some integration tests exist, such as `FileGenerator.integration.test.ts`, indicating a practice of testing the interaction between different modules.

- **Component Tests:** Currently, there are no component-specific tests (`.test.tsx` files). However, the testing setup with `vitest` and `happy-dom` allows for rendering components and testing their behavior, suggesting that this is an area for future expansion.

- **Running Tests:** All tests can be executed by running the `yarn test` command.

# Building and Running

To get started with local development, follow these steps:

1.  **Install Dependencies:**

    ```bash
    yarn install
    ```

2.  **Run the Development Server:**

    ```bash
    yarn start
    ```

    The application will be available at `http://localhost:3000`.

3.  **Build for Production:**

    ```bash
    yarn build
    ```

4.  **Run Tests:**
    ```bash
    yarn test
    ```

# Development Conventions

- **Formatting:** This project uses Prettier for code formatting. Run `yarn format` before committing changes.
- **Linting:** ESLint is used for linting. Run `yarn lint` to check for any linting errors.
- **Type Checking:** TypeScript is used for static typing. Run `yarn type-check` to check for type errors.
- **Contribution:** Before contributing, please read the `CONTRIBUTING.md` file.
