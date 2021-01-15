import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    hoverKey: state.keycodeKey.hoverKey,
    keyboard: state.entities.keyboard,
    setupPhase: state.app.setupPhase,
    keyboards: state.entities.keyboards,
    keyboardHeight: state.app.keyboardHeight,
  };
};
export type ContentStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type ContentActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
