import React from 'react';
import { SnackbarProvider } from 'notistack';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StyledComponentProps, withStyles } from '@material-ui/core/styles';
import Configure from './components/configure/Configure.container';
import Hid from './services/hid/ui/Hid';
import Top from './components/top/Top.container';
import KeyboardDefinitionManagement from './components/keyboards/KeyboardDefinitionManagement.container';
import Catalog from './components/catalog/Catalog.container';
import { Firmware } from './services/firmware/ui/Firmware';
import Documents from './components/documents/Documents.container';
import OrganizationManagement from './components/organizations/OrganizationManagement.container';

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
            <Route path="/catalog">
              <Catalog />
            </Route>
            <Route path="/catalog/:definitionId/firmware">
              <Catalog catalogDetailMode="firmware" />
            </Route>
            <Route path="/catalog/:definitionId/keymap">
              <Catalog catalogDetailMode="keymap" />
            </Route>
            <Route path="/catalog/:definitionId">
              <Catalog catalogDetailMode="introduction" />
            </Route>
            <Route path="/docs/:docId" element={<Documents />} />
            <Route path="/docs" element={<Documents />} />
            <Route element={<Top />} />
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
