import { connect } from 'react-redux';
import KeymapSaveDialog from './KeymapSaveDialog';
import { RootState } from '../../../store/state';
import { storageActionsThunk } from '../../../actions/storage.action';
import {
  SavedRegisteredKeymapData,
  SavedUnregisteredKeymapData,
} from '../../../services/storage/Storage';

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
    createSavedRegisteredKeymap: (keymapData: SavedRegisteredKeymapData) => {
      _dispatch(storageActionsThunk.createRegisteredKeymapData(keymapData));
    },
    updateSavedRegisteredKeymap: (keymapData: SavedRegisteredKeymapData) => {
      _dispatch(storageActionsThunk.updateRegisteredKeymapData(keymapData));
    },
    deleteSavedRegisteredKeymap: (keymapData: SavedRegisteredKeymapData) => {
      _dispatch(storageActionsThunk.deleteRegisteredKeymapData(keymapData));
    },
    createSavedUnregisteredKeymap: (
      keymapData: SavedUnregisteredKeymapData
    ) => {
      _dispatch(storageActionsThunk.createUnregisteredKeymapData(keymapData));
    },
    updateSavedUnregisteredKeymap: (
      keymapData: SavedUnregisteredKeymapData
    ) => {
      _dispatch(storageActionsThunk.updateUnregisteredKeymapData(keymapData));
    },
    deleteSavedUnregisteredKeymap: (
      keymapData: SavedUnregisteredKeymapData
    ) => {
      _dispatch(storageActionsThunk.deleteUnregisteredKeymapData(keymapData));
    },
  };
};

export type KeymapSaveDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapSaveDialog);
