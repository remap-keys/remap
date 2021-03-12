import { connect } from 'react-redux';
import Header from './Header';
import { RootState } from '../../../store/state';
import { hidActionsThunk } from '../../../actions/hid.action';
import { IKeyboard } from '../../../services/hid/Hid';
import { AppActionsThunk, HeaderActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  const kbd = state.entities.keyboard;
  const info = kbd?.getInformation();
  return {
    draggingKey: state.configure.keycodeKey.draggingKey,
    flashing: state.configure.header.flashing,
    keyboards: state.entities.keyboards,
    keyboard: state.entities.keyboard,
    productId: info?.productId || NaN,
    productName: info?.productName || '',
    vendorId: info?.vendorId || NaN,
    showKeyboardList: !!kbd,
    remaps: state.app.remaps,
    auth: state.auth.instance,
    signedIn: state.app.signedIn,
  };
};
export type HeaderStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickKeyboardMenuItem: (kbd: IKeyboard) => {
      _dispatch(hidActionsThunk.connectKeyboard(kbd));
    },
    onClickAnotherKeyboard: () => {
      _dispatch(hidActionsThunk.connectAnotherKeyboard());
    },
    onClickFlashButton: () => {
      _dispatch(HeaderActions.updateFlashing(true));
      _dispatch(hidActionsThunk.flash());
    },
    logout: () => {
      _dispatch(AppActionsThunk.logout());
    },
    linkToGoogleAccount: () => {
      _dispatch(AppActionsThunk.linkToGoogleAccount());
    },
    linkToGitHubAccount: () => {
      _dispatch(AppActionsThunk.linkToGitHubAccount());
    },
  };
};
export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
