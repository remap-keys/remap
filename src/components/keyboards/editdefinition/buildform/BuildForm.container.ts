import { RootState } from '../../../../store/state';
import { connect } from 'react-redux';
import BuildForm from './BuildForm';

const mapStateToProps = (state: RootState) => {
  return {};
};
export type BuildFormStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type BuildFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(BuildForm);
