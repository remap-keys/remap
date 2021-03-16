import { connect } from 'react-redux';
import KeymapSaveDialog from './KeymapSaveDialog';
import { RootState } from '../../../store/state';
import { storageActionsThunk } from '../../../actions/storage.action';
import { ISavedKeymapData } from '../../../services/storage/Storage';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    keymaps: state.entities.device.keymaps,
    labelLang: state.app.labelLang,
    layerCount: state.entities.device.layerCount,
    layoutLabels: state.entities.keyboardDefinition?.layouts.labels,
    selectedLayoutOptions: state.configure.layoutOptions.selectedOptions,
    keyboardDefinitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type KeymapSaveDialogStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    createSavedKeymapData: (keymapData: ISavedKeymapData) => {
      _dispatch(storageActionsThunk.createSavedKeymapData(keymapData));
    },
    updateSavedKeymapData: (keymapData: ISavedKeymapData) => {
      _dispatch(storageActionsThunk.updateSavedKeymapData(keymapData));
    },
    deleteSavedKeymapData: (keymapData: ISavedKeymapData) => {
      _dispatch(storageActionsThunk.deleteSavedKeymapData(keymapData));
    },
  };
};

export type KeymapSaveDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapSaveDialog);
