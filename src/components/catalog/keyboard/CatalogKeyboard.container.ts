import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogKeyboard from './CatalogKeyboard';
import { IMetaData, MetaActions } from '../../../actions/meta.action';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  catalogActionsThunk,
  CatalogAppActions,
  CatalogKeyboardActions,
} from '../../../actions/catalog.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    phase: state.catalog.app.phase,
    definitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type CatalogKeyboardStateType = ReturnType<typeof mapStateToProps> &
  RouteComponentProps;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateMeta: (data: IMetaData) => {
      _dispatch(MetaActions.update(data));
    },
    initializeMeta: () => {
      _dispatch(MetaActions.initialize());
    },
    goToIntroduction: () => {
      _dispatch(CatalogAppActions.updatePhase('introduction'));
    },
    goToKeymap: () => {
      _dispatch(CatalogKeyboardActions.clearKeymap());
      _dispatch(CatalogAppActions.updatePhase('keymap'));
    },
    applySharedKeymap: (definitionId: string, keymapId: string) => {
      _dispatch(catalogActionsThunk.applySharedKeymap(definitionId, keymapId));
    },
    goToFirmware: () => {
      _dispatch(CatalogAppActions.updatePhase('firmware'));
    },
  };
};
export type CatalogKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CatalogKeyboard)
);
