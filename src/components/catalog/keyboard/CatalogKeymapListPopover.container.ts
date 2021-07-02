import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymapListPopover from './CatalogKeymapListPopover';
import { IKeymap } from '../../../services/hid/Hid';
import { LayoutOption } from '../../configure/keymap/Keymap';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import {
  AppActions,
  KeydiffActions,
  LayoutOptionsActions,
} from '../../../actions/actions';
import { CatalogKeyboardActions } from '../../../actions/catalog.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    sharedKeymaps: state.entities.sharedKeymaps,
  };
};
export type CatalogKeymapListPopoverStateType = ReturnType<
  typeof mapStateToProps
>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    applySavedKeymapData: (
      keymaps: { [pos: string]: IKeymap }[],
      layoutOptions: LayoutOption[],
      labelLang: KeyboardLabelLang
    ) => {
      _dispatch(AppActions.updateLangLabel(labelLang));
      _dispatch(KeydiffActions.clearKeydiff());
      _dispatch(CatalogKeyboardActions.updateKeymaps(keymaps));
      _dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
    },
  };
};
export type CatalogKeymapListPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogKeymapListPopover);
