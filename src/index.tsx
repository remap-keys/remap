import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import reducers from './store/reducers';
import reportWebVitals from './reportWebVitals';
import { errorReportingLogger } from './utils/ErrorReportingLogger';
import OGP from './components/common/ogp/OGP.container';
import { HelmetProvider } from 'react-helmet-async';

const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk),
    applyMiddleware(errorReportingLogger)
  )
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <HelmetProvider>
        <OGP />
        <App />
      </HelmetProvider>
    </React.StrictMode>
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
