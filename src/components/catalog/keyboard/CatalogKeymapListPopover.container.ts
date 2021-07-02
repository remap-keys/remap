import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymapListPopover from './CatalogKeymapListPopover';
import { IKeymap } from '../../../services/hid/Hid';
import { LayoutOption } from '../../configure/keymap/Keymap';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import { LayoutOptionsActions } from '../../../actions/actions';
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
      _dispatch(CatalogKeyboardActions.updateLangLabel(labelLang));
      _dispatch(CatalogKeyboardActions.updateKeymaps(keymaps));
      _dispatch(LayoutOptionsActions.restoreLayoutOptions(layoutOptions));
      _dispatch(CatalogKeyboardActions.updateSelectedLayer(0));
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
