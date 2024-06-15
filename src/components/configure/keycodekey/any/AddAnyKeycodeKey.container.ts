import { connect } from 'react-redux';
import AddAnyKeycodeKey from './AddAnyKeycodeKey';
import { RootState } from '../../../../store/state';
import { AnyKeycodeKeyActions } from '../../../../actions/actions';
import { AnyKey } from '../KeycodeKey';

const mapStateToProps = (_state: RootState) => {
  return {};
};
export type KeycodeAddKeyStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    addAnyKey: (key: AnyKey) => {
      _dispatch(AnyKeycodeKeyActions.addAnyKey(key));
    },
  };
};
export type KeycodeAddKeyActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(AddAnyKeycodeKey);
