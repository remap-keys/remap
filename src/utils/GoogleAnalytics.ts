import firebase from 'firebase/app';
import 'firebase/analytics';

type IActionName =
  | 'configure/cheat_sheet'
  | 'configure/clear_all_changes'
  | 'configure/flash'
  | 'configure/flash_macro'
  | 'configure/import_local_file'
  | 'configure/lighting'
  | 'configure/open'
  | 'configure/save_keymap'
  | 'configure/restore_keymap'
  | 'catalog/search'
  | 'catalog/clear_search_condition'
  | 'catalog/open_from_search'
  | 'catalog/back_to_search'
  | 'catalog/introduction'
  | 'catalog/keymap'
  | 'catalog/firmware'
  | 'catalog/apply_keymap'
  | 'catalog/cheat_sheet'
  | 'catalog/same_author_keyboard'
  | 'catalog/download_firmware'
  | 'catalog/flash_firmware'
  | 'docs/review_policy'
  | 'docs/terms_of_use'
  | 'docs/faq'
  | 'docs/support-qmk-022'
  | 'docs/encoders';

interface IActionOptions {
  vendor_id?: string | number;
  product_id?: string | number;
  product_name?: string;
}

let analytics: firebase.analytics.Analytics | null;
try {
  analytics = firebase.analytics();
} catch (cause) {
  if (process.env.NODE_ENV === 'production') {
    throw cause;
  } else {
    analytics = null;
  }
}

export const sendEventToGoogleAnalytics = (
  action: IActionName,
  options?: IActionOptions
) => {
  if (analytics) {
    analytics.logEvent<IActionName>(action, options);
  }
};
