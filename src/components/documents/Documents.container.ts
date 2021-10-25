import { connect } from 'react-redux';
import { IDocumentPage, RootState } from '../../store/state';
import Documents from './Documents';
import { MetaActions } from '../../actions/meta.action';
import { AppActions, DocumentsActions } from '../../actions/actions';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return { auth: state.auth.instance };
};
export type DocumentsStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    initializeMeta: () => {
      _dispatch(MetaActions.initialize());
    },
    updateDocumentPage: (page: IDocumentPage | null) => {
      _dispatch(DocumentsActions.updatePage(page));
    },
    updateSignedIn: (signedIn: boolean) => {
      _dispatch(AppActions.updateSignedIn(signedIn));
    },
  };
};
export type DocumentsActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Documents);
