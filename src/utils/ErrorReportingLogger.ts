import { RootState } from '../store/state';
import { Action, AnyAction } from 'redux';
import {
  NOTIFICATION_ADD_ERROR,
  NOTIFICATION_ADD_WARN,
} from '../actions/actions';

const StackdriverErrorReporter = require('stackdriver-errors-js/dist/stackdriver-errors-concat.min');
const errorHandler = new StackdriverErrorReporter();
if (process.env.NODE_ENV === 'production') {
  errorHandler.start({
    key: process.env.REACT_APP_ERROR_REPORTING_KEY,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  });
}

// eslint-disable-next-line no-unused-vars
export const errorReportingLogger = (store: { getState: () => RootState }) => (
  // eslint-disable-next-line no-unused-vars
  next: (action: Action) => void
) => (action: AnyAction) => {
  if ([NOTIFICATION_ADD_ERROR, NOTIFICATION_ADD_WARN].includes(action.type)) {
    if (process.env.NODE_ENV === 'production') {
      if (action.value.cause) {
        errorHandler.report(action.value.cause);
      } else {
        errorHandler.report(action.value.message);
      }
    }
  }
  next(action);
};
