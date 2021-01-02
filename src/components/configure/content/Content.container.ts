import { connect } from 'react-redux';
import Content from './Content';
import { RootState } from '../../../store/state';
import { IKeyboard } from '../../../services/hid/hid';

export type ContentStateType = {
  openedKeyboard: IKeyboard | null;
  keyboards: IKeyboard[];
};
const mapStateToProps = (state: RootState): ContentStateType => {
  return {
    openedKeyboard: state.hid.openedKeyboard,
    keyboards: state.hid.keyboards,
  };
};

const mapDispatchToProps = {};

export type ContentActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Content);
