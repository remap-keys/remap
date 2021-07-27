import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeymapList from './CatalogKeymapList';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    sharedKeymaps: state.entities.sharedKeymaps,
    definitionDocument: state.entities.keyboardDefinitionDocument,
    selectedKeymapData: state.catalog.keyboard.selectedKeymapData,
  };
};
export type CatalogKeymapListStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type CatalogKeymapListActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogKeymapList);
