import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import { TypingPractice } from './TypingPractice';
import {
  PracticeActions,
  PracticeActionsThunk,
  KeymapToolbarActions,
} from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  const keyboardDef = state.entities.keyboardDefinitionDocument;
  return {
    keyboardId: keyboardDef?.id,
    vendorId: keyboardDef?.vendorId,
    productId: keyboardDef?.productId,
    signedIn: state.app.signedIn,
    currentCategory: state.configure.practice.currentCategory,
    sentences: state.configure.practice.sentences,
    currentSentenceIndex: state.configure.practice.currentSentenceIndex,
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
  updateStats: PracticeActions.updateStats,
  reset: PracticeActions.reset,
  resetStatistics: PracticeActionsThunk.resetTypingStats,
  loadTypingStats: PracticeActionsThunk.loadTypingStats,
  saveTypingStats: PracticeActionsThunk.saveTypingStats,
  finish: PracticeActions.finish,
  updateText: PracticeActions.updateText,
  updateCategory: PracticeActions.updateCategory,
  updateSentences: PracticeActions.updateSentences,
  nextSentence: PracticeActions.nextSentence,
  exitPracticeMode: () => KeymapToolbarActions.updateTypingPractice(false),
};
export type TypingPracticeActionsType = {
  start: typeof PracticeActions.start;
  updateInput: typeof PracticeActions.updateInput;
  updateStats: typeof PracticeActions.updateStats;
  reset: typeof PracticeActions.reset;
  resetStatistics: (keyboardDefinitionId: string) => void;
  loadTypingStats: (keyboardDefinitionId: string) => void;
  saveTypingStats: (keyboardDefinitionId: string) => void;
  finish: typeof PracticeActions.finish;
  updateText: typeof PracticeActions.updateText;
  updateCategory: typeof PracticeActions.updateCategory;
  updateSentences: typeof PracticeActions.updateSentences;
  nextSentence: typeof PracticeActions.nextSentence;
  exitPracticeMode: () => void;
};

export default connect(mapStateToProps, mapDispatchToProps)(TypingPractice);
