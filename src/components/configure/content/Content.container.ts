import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    setupPhase: state.app.setupPhase,
    keyboards: state.entities.keyboards,
    keyboardDefinition: state.entities.keyboardDefinition,
  };
};
export type ContentStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type ContentActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
