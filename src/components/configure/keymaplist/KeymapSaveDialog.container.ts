import { connect } from 'react-redux';
import KeymapSaveDialog from './KeymapSaveDialog';
import { RootState } from '../../../store/state';
import { storageActionsThunk } from '../../../actions/storage.action';
import { SavedKeymapData } from '../../../services/storage/Storage';

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
    createSavedKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.createSavedKeymap(keymapData));
    },
    updateSavedKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.updateSavedKeymap(keymapData));
    },
    deleteSavedKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.deleteSavedKeymap(keymapData));
    },
  };
};

export type KeymapSaveDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapSaveDialog);
