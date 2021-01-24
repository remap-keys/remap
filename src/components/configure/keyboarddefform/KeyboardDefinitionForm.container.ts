import { connect } from 'react-redux';
import { NotificationActions } from '../../../actions/actions';
import { RootState } from '../../../store/state';
import KeyboardDefinitionForm from './KeyboardDefinitionForm';
import { storageActionsThunk } from '../../../actions/storage.action';
import { KeyboardDefinitionSchema } from '../../../gen/types/KeyboardDefinition';
import { IKeyboard } from '../../../services/hid/Hid';

const mapStateToProps = (state: RootState) => {
  const kbd = state.entities.keyboard;
  const info = kbd?.getInformation();

  return {
    keyboard: state.entities.keyboard,
    productName: info?.productName,
  };
};
export type KeyboardDefinitionFormStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    warn: (msg: string) => {
      _dispatch(NotificationActions.addWarn(msg));
    },
    // eslint-disable-next-line no-undef
    onDropFile: (def: KeyboardDefinitionSchema) => {
      _dispatch(storageActionsThunk.uploadKeyboardDefinition(def));
    },
  };
};
export type KeyboardDefinitionFormActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyboardDefinitionForm);
