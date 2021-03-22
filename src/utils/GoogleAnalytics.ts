import firebase from 'firebase/app';
import 'firebase/analytics';

type IActionName =
  | 'configure/flash'
  | 'configure/open'
  | 'configure/cheat_sheet'
  | 'configure/clear_all_changes'
  | 'configure/lighting'
  | 'configure/import_local_file'
  | 'configure/save_keymap'
  | 'configure/restore_keymap';

interface IActionOptions {
  vendor_id?: string | number;
  product_id?: string | number;
  product_name?: string;
}

const analytics = firebase.analytics();

export const sendEventToGoogleAnalytics = (
  action: IActionName,
  options?: IActionOptions
) => {
  analytics.logEvent<IActionName>(action, options);
};
