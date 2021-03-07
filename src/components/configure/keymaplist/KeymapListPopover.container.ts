import { connect } from 'react-redux';
import KeymapListPopover from './KeymapListPopover';
import { RootState } from '../../../store/state';
import { ISavedKeymapData } from '../../../services/storage/Storage';
import { storageActionsThunk } from '../../../actions/storage.action';
import { AppActions, KeydiffActions } from '../../../actions/actions';
import { KeyboardLabelLang } from '../../../services/labellang/KeyLabelLangs';
import { IKeymap } from '../../../services/hid/Hid';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    savedKeymaps: state.entities.savedKeymaps,
    keymaps: state.entities.device.keymaps,
  };
};
export type KeymapListPopoverStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    createSavedKeymapData: (keymapData: ISavedKeymapData) => {
      _dispatch(storageActionsThunk.createMySavedKeymapData(keymapData));
    },
    applySavedKeymapData: (
      keymaps: { [pos: string]: IKeymap }[],
      labelLang: KeyboardLabelLang
    ) => {
      _dispatch(AppActions.updateLangLabel(labelLang));
      _dispatch(KeydiffActions.clearKeydiff());
      _dispatch(AppActions.remapsSetKeys(keymaps));
    },
  };
};

export type KeymapListPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapListPopover);
