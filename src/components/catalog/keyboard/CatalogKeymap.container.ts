import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymap from './Catalogkeymap';
import {
  CatalogAppActions,
  CatalogKeyboardActions,
} from '../../../actions/catalog.action';
import { storageActionsThunk } from '../../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    keyboardDefinition: state.entities.keyboardDefinition,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    keymaps: state.catalog.keyboard.keymaps,
    selectedLayer: state.catalog.keyboard.selectedLayer,
    langLabel: state.catalog.keyboard.langLabel,
  };
};
export type CatalogKeymapStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    goToIntroduction: () => {
      _dispatch(CatalogAppActions.updatePhase('introduction'));
    },
    goToSearch: () => {
      _dispatch(storageActionsThunk.searchKeyboardsForCatalog());
    },
    updateSelectedLayer: (layer: number) => {
      _dispatch(CatalogKeyboardActions.updateSelectedLayer(layer));
    },
  };
};
export type CatalogKeymapActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogKeymap);
