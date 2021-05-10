import { connect } from 'react-redux';
import Catalog from './Catalog';
import { RootState } from '../../store/state';
import { NotificationActions } from '../../actions/actions';
import { CatalogAppActions } from '../../actions/catalog.action';
import { storageActionsThunk } from '../../actions/storage.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
  };
};
export type CatalogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      _dispatch(NotificationActions.removeNotification(key));
    },
    updateKeyboard: (definitionId: string) => {
      _dispatch(CatalogAppActions.updatePhase('processing'));
      _dispatch(
        storageActionsThunk.fetchKeyboardDefinitionForCatalogById(definitionId)
      );
    },
  };
};

export type CatalogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
