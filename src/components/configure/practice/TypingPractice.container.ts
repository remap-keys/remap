import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import { TypingPractice } from './TypingPractice';
import {
  PracticeActions,
  KeymapToolbarActions,
} from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    currentText: state.configure.practice.currentText,
    userInput: state.configure.practice.userInput,
    currentIndex: state.configure.practice.currentIndex,
    errors: state.configure.practice.errors,
    stats: state.configure.practice.stats,
    status: state.configure.practice.status,
  };
};
export type TypingPracticeStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
  start: PracticeActions.start,
  updateInput: PracticeActions.updateInput,
  reset: PracticeActions.reset,
  finish: PracticeActions.finish,
  updateText: PracticeActions.updateText,
  exitPracticeMode: () => KeymapToolbarActions.updateTypingPractice(false),
};
export type TypingPracticeActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TypingPractice);
