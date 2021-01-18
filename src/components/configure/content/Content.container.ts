import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    setupPhase: state.app.setupPhase,
  };
};
export type ContentStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type ContentActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
