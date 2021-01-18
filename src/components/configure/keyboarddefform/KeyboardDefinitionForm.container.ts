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

// eslint-disable-next-line no-undef
export const isJsonFile = (file: File): boolean => {
  return file.type.endsWith('/json');
};

// eslint-disable-next-line no-undef
export const loadDefinitionFile = async (file: File): Promise<string> => {
  // eslint-disable-next-line no-undef
  const loadTextFile = (file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      // eslint-disable-next-line no-undef
      const fileReader = new FileReader();
      fileReader.addEventListener('load', () => {
        resolve(fileReader.result as string);
      });
      fileReader.readAsText(file);
    });
  };
  const json = await loadTextFile(file);
  return json;
};

export const validateIds = (
  keyboardDefinition: KeyboardDefinitionSchema,
  keyboard: IKeyboard
): string | null => {
  const getNumber = (source: string): number => {
    if (!source) {
      return NaN;
    } else if (source.startsWith('0x')) {
      const target = source.substring(2);
      return Number.parseInt(target, 16);
    } else {
      return Number.parseInt(source);
    }
  };
  const vendorId = getNumber(keyboardDefinition.vendorId);
  const productId = getNumber(keyboardDefinition.productId);
  if (vendorId !== keyboard.getInformation().vendorId) {
    return `Invalid the vendor ID: ${vendorId}`;
  }
  if (productId !== keyboard.getInformation().productId) {
    return `Invalid the product ID: ${productId}`;
  }
  return null;
};
