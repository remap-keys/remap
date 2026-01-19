import firebase from 'firebase/app';
import 'firebase/analytics';

type IActionName =
  | 'catalog/apply_keymap'
  | 'catalog/back_to_search'
  | 'catalog/build'
  | 'catalog/build_build_firmware'
  | 'catalog/build_change_description'
  | 'catalog/build_delete_firmware'
  | 'catalog/build_download_firmware'
  | 'catalog/build_flash_firmware'
  | 'catalog/cheat_sheet'
  | 'catalog/clear_search_condition'
  | 'catalog/download_firmware'
  | 'catalog/firmware'
  | 'catalog/flash_firmware'
  | 'catalog/introduction'
  | 'catalog/keymap'
  | 'catalog/open_from_search'
  | 'catalog/same_author_keyboard'
  | 'catalog/search'
  | 'configure/cheat_sheet'
  | 'configure/clear_all_changes'
  | 'configure/flash'
  | 'configure/flash_macro'
  | 'configure/import_local_file'
  | 'configure/lighting'
  | 'configure/open'
  | 'configure/restore_keymap'
  | 'configure/save_keymap'
  | 'docs/build'
  | 'docs/encoders'
  | 'docs/faq'
  | 'docs/review_policy'
  | 'docs/statistics'
  | 'docs/support-code-editing'
  | 'docs/support-qmk-022'
  | 'docs/terms_of_use'
  | 'docs/internationalization'
  | 'docs/ebizrule'
  | 'docs/workbench'
  | 'docs/typing-practice'
  | 'practice/start'
  | 'practice/reset'
  | 'practice/category_change'
  | 'practice/complete'
  | 'practice/exit'
  | 'practice/reset_statistics';

interface IActionOptions {
  vendor_id?: string | number;
  product_id?: string | number;
  product_name?: string;
  category_id?: string;
}

let analytics: firebase.analytics.Analytics | null;
try {
  analytics = firebase.analytics();
} catch (cause) {
  if (import.meta.env.NODE_ENV === 'production') {
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
