import { connect } from 'react-redux';
import Header from './Header';
import { RootState } from '../../../store/state';
import { hidActionsThunk } from '../../../actions/hid.action';
import { IKeyboard } from '../../../services/hid/hid';

export type HeaderStateType = {
  keyboards: IKeyboard[];
  openedKeyboard: IKeyboard | null;
  productId: number;
  productName: string;
  vendorId: number;
  showKeyboardList: boolean;
};
const mapStateToProps = (state: RootState): HeaderStateType => {
  const kbd = state.hid.openedKeyboard;
  const info = kbd?.getInformation();
  return {
    keyboards: state.hid.keyboards,
    openedKeyboard: kbd,
    productId: info?.productId || NaN,
    productName: info?.productName || '',
    vendorId: info?.vendorId || NaN,
    showKeyboardList: !!kbd,
  };
};

const mapDispatchToProps = (_dispatch: any) => {
  return {
    onClickKeyboardMenuItem: (kbd: IKeyboard) =>
      _dispatch(hidActionsThunk.openKeyboard(kbd)),
    onClickAnotherKeyboard: () =>
      _dispatch(hidActionsThunk.connectAnotherKeyboard()),
  };
};

export type HeaderActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
