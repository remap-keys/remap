import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import KeyboardList from './KeyboardList';

const mapStateToProps = (state: RootState) => {
  return {
    keyboardDefinitionDocuments: state.entities.keyboardDefinitionDocuments,
  };
};
export type KeyboardListStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type KeyboardListActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeyboardList);
