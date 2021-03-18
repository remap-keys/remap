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
    createSavedRegisteredKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.createRegisteredKeymapData(keymapData));
    },
    updateSavedRegisteredKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.updateRegisteredKeymapData(keymapData));
    },
    deleteSavedRegisteredKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.deleteRegisteredKeymapData(keymapData));
    },
    createSavedUnregisteredKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.createUnregisteredKeymapData(keymapData));
    },
    updateSavedUnregisteredKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.updateUnregisteredKeymapData(keymapData));
    },
    deleteSavedUnregisteredKeymap: (keymapData: SavedKeymapData) => {
      _dispatch(storageActionsThunk.deleteUnregisteredKeymapData(keymapData));
    },
  };
};

export type KeymapSaveDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapSaveDialog);
