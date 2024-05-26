import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import reducers from './store/reducers';
import { errorReportingLogger } from './utils/ErrorReportingLogger';
import OGP from './components/common/ogp/OGP.container';
import { HelmetProvider } from 'react-helmet-async';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(errorReportingLogger)
  )
);

const theme = createTheme({});

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <HelmetProvider>
        <OGP />
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);
