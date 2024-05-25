import { RootState } from '../store/state';
import { Action, AnyAction } from 'redux';
import {
  NOTIFICATION_ADD_ERROR,
  NOTIFICATION_ADD_WARN,
} from '../actions/actions';
import StackdriverErrorReporter from 'stackdriver-errors-js';

const errorHandler = new StackdriverErrorReporter();
if (process.env.NODE_ENV === 'production') {
  errorHandler.start({
    key: process.env.REACT_APP_ERROR_REPORTING_KEY,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  });
}

// eslint-disable-next-line no-unused-vars
export const errorReportingLogger =
  (store: { getState: () => RootState }) =>
  (
    // eslint-disable-next-line no-unused-vars
    next: (action: Action) => void,
  ) =>
  (action: AnyAction) => {
    if ([NOTIFICATION_ADD_ERROR, NOTIFICATION_ADD_WARN].includes(action.type)) {
      if (process.env.NODE_ENV === 'production') {
        let message;
        if (action.value.cause) {
          message = `${action.value.message}: ${action.value.cause.message}`;
        } else {
          message = action.value.message;
        }
        const { entities, app } = store.getState();
        const additional: any = {
          version: app.package.version,
          setupPhase: app.setupPhase,
        };
        if (entities.keyboard) {
          additional.keyboard = {
            vendorId: entities.keyboard.getInformation().vendorId,
            productId: entities.keyboard.getInformation().productId,
            productName: entities.keyboard.getInformation().productName,
          };
        }
        const err = new Error(message);
        if (action.value.cause) {
          err.stack = additional + '\n' + action.value.cause.stack;
        } else {
          err.stack = additional;
        }
        errorHandler.report(err);
      }
    }
    next(action);
  };
