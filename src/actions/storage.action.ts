import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState, SetupPhase } from '../store/state';
import {
  AppActions,
  LayoutOptionsActions,
  NotificationActions,
} from './actions';
import { hidActionsThunk } from './hid.action';
import { validateKeyboardDefinition } from '../services/storage/Validator';
import { KeyboardDefinitionSchema } from '../gen/types/KeyboardDefinition';

export const STORAGE_ACTIONS = '@Storage';
export const STORAGE_UPDATE_KEYBOARD_DEFINITION = `${STORAGE_ACTIONS}/UpdateKeyboardDefinition`;
export const StorageActions = {
  updateKeyboardDefinition: (keyboardDefinition: any) => {
    return {
      type: STORAGE_UPDATE_KEYBOARD_DEFINITION,
      value: keyboardDefinition,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof StorageActions[keyof typeof StorageActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const storageActionsThunk = {
  // eslint-disable-next-line no-undef
  uploadKeyboardDefinition: (file: File): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    if (!file.type.endsWith('/json')) {
      dispatch(NotificationActions.addWarn('The file is not JSON format.'));
      return;
    }

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

    const validateResult = validateKeyboardDefinition(json);
    if (!validateResult.valid) {
      dispatch(NotificationActions.addWarn(validateResult.errorMessage!));
      return;
    }

    const keyboardDefinition = JSON.parse(json);
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

    const { entities } = getState();
    const keyboard = entities.keyboard;
    const vendorId = getNumber(keyboardDefinition.vendorId);
    const productId = getNumber(keyboardDefinition.productId);

    if (vendorId !== keyboard?.getInformation().vendorId) {
      dispatch(
        NotificationActions.addWarn(`Invalid the vendor ID: ${vendorId}`)
      );
      return;
    }
    if (productId !== keyboard?.getInformation().productId) {
      dispatch(
        NotificationActions.addWarn(`Invalid the product ID: ${productId}`)
      );
      return;
    }

    dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
    dispatch(
      LayoutOptionsActions.initSelectedOptions(
        keyboardDefinition.layouts.labels
          ? keyboardDefinition.layouts.labels
          : []
      )
    );
    dispatch(AppActions.updateSetupPhase(SetupPhase.openingKeyboard));
    dispatch(hidActionsThunk.openKeyboard());
  },

  fetchKeyboardDefinition: (
    // eslint-disable-next-line no-unused-vars
    vendorId: number,
    // eslint-disable-next-line no-unused-vars
    productId: number
  ): ThunkPromiseAction<void> => async (
    dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
    getState: () => RootState
  ) => {
    const { entities, storage } = getState();
    const keyboard = entities.keyboard!;
    const keyboardInfo = keyboard.getInformation();
    const vendorId = keyboardInfo.vendorId;
    const productId = keyboardInfo.productId;
    const fetchKeyboardDefinitionResult = await storage.instance.fetchKeyboardDefinition(
      vendorId,
      productId
    );
    if (!fetchKeyboardDefinitionResult.success) {
      console.error(fetchKeyboardDefinitionResult.cause!);
      dispatch(
        NotificationActions.addError(
          fetchKeyboardDefinitionResult.error!,
          fetchKeyboardDefinitionResult.cause
        )
      );
      return;
    }
    if (fetchKeyboardDefinitionResult.exists!) {
      const json = fetchKeyboardDefinitionResult.document!.json;
      const validateResult = validateKeyboardDefinition(json);
      if (!validateResult.valid) {
        dispatch(NotificationActions.addError(validateResult.errorMessage!));
        dispatch(
          AppActions.updateSetupPhase(
            SetupPhase.waitingKeyboardDefinitionUpload
          )
        );
        return;
      }

      const keyboardDefinition: KeyboardDefinitionSchema = JSON.parse(json);
      dispatch(StorageActions.updateKeyboardDefinition(keyboardDefinition));
      dispatch(
        LayoutOptionsActions.initSelectedOptions(
          keyboardDefinition.layouts.labels
            ? keyboardDefinition.layouts.labels
            : []
        )
      );
      dispatch(AppActions.updateSetupPhase(SetupPhase.openingKeyboard));
      dispatch(hidActionsThunk.openKeyboard());
    } else {
      dispatch(
        AppActions.updateSetupPhase(SetupPhase.waitingKeyboardDefinitionUpload)
      );
    }
  },
};
