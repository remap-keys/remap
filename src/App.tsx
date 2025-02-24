import React from 'react';
import { SnackbarProvider } from 'notistack';
// import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Configure from './components/configure/Configure.container';
import Hid from './services/hid/ui/Hid';
import Top from './components/top/Top.container';
import KeyboardDefinitionManagement from './components/keyboards/KeyboardDefinitionManagement.container';
import Catalog from './components/catalog/Catalog.container';
import { Firmware } from './services/firmware/ui/Firmware';
import Documents from './components/documents/Documents.container';
import OrganizationManagement from './components/organizations/OrganizationManagement.container';
import { StyledComponentProps, withStyles } from '@mui/styles';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enJson from './assets/locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enJson,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

class App extends React.Component<StyledComponentProps, {}> {
  constructor(
    props: StyledComponentProps<string> | Readonly<StyledComponentProps<string>>
  ) {
    super(props);
  }
  render() {
    return (
      <SnackbarProvider
        dense
        preventDuplicate
        hideIconVariant
        maxSnack={4}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{
          variantSuccess: this.props.classes!.success,
          variantError: this.props.classes!.error,
          variantWarning: this.props.classes!.warning,
          variantInfo: this.props.classes!.info,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/hid" element={<Hid />} />
            <Route path="/firmware" element={<Firmware />} />
            <Route path="/configure" element={<Configure />} />
            <Route
              path="/keyboards"
              element={<KeyboardDefinitionManagement />}
            />
            <Route
              path="/keyboards/:definitionId"
              element={<KeyboardDefinitionManagement />}
            />
            <Route path="/organizations" element={<OrganizationManagement />} />
            <Route
              path="/organizations/:organizationId"
              element={<OrganizationManagement />}
            />
            <Route path="/catalog" element={<Catalog />} />
            <Route
              path="/catalog/:definitionId/build"
              element={<Catalog catalogDetailMode="build" />}
            />
            <Route
              path="/catalog/:definitionId/firmware"
              element={<Catalog catalogDetailMode="firmware" />}
            />
            <Route
              path="/catalog/:definitionId/keymap"
              element={<Catalog catalogDetailMode="keymap" />}
            />
            <Route
              path="/catalog/:definitionId"
              element={<Catalog catalogDetailMode="introduction" />}
            />
            <Route path="/docs/:docId" element={<Documents />} />
            <Route path="/docs" element={<Documents />} />
            <Route path="/" element={<Top />} />
            <Route path="/*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    );
  }
}
const styles = () => ({
  success: { backgroundColor: '#3f51b5!important' },
  error: { backgroundColor: '#f44336!important' },
  warning: { backgroundColor: '#ff9800!important' },
  info: { backgroundColor: '#8bc34a!important' },
});

export default withStyles(styles, { withTheme: true })(App);
