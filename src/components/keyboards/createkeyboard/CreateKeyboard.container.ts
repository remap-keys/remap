import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CreateKeyboard from './CreateKeyboard';

const mapStateToProps = (state: RootState) => {
  return {};
};
export type CreateKeyboardStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type CreateKeyboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CreateKeyboard);
