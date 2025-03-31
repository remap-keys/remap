import { connect } from 'react-redux';
import { RootState } from '../../store/state';
import Top from './Top';
import { MetaActions } from '../../actions/meta.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (_state: RootState) => {
  return {};
};
export type TopStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (dispatch: any) => {
  return {
    initializeMeta: () => {
      dispatch(MetaActions.initialize());
    },
  };
};
export type TopActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Top);
