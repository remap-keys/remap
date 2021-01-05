import { connect } from 'react-redux';
import Header from './Header';
import { RootState } from '../../../store/state';
import { hidActionsThunk } from '../../../actions/hid.action';
import { IKeyboard } from '../../../services/hid/hid';
import { HeaderActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  const kbd = state.hid.openedKeyboard;
  const info = kbd?.getInformation();
  return {
    flushLoading: state.header.flushLoading,
    keyboards: state.hid.keyboards,
    openedKeyboard: kbd,
    productId: info?.productId || NaN,
    productName: info?.productName || '',
    vendorId: info?.vendorId || NaN,
    showKeyboardList: !!kbd,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickKeyboardMenuItem: (kbd: IKeyboard) => {
      _dispatch(hidActionsThunk.updateOpeningKeyboard(true));
      _dispatch(hidActionsThunk.openKeyboard(kbd));
    },
    onClickAnotherKeyboard: () => {
      _dispatch(hidActionsThunk.updateOpeningKeyboard(true));
      _dispatch(hidActionsThunk.connectAnotherKeyboard());
    },
    onClickFlushButton: () => {
      _dispatch(HeaderActions.updateFlush(true));
      setTimeout(() => {
        _dispatch(HeaderActions.updateFlush(false));
      }, 2000);
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
