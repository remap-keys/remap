import { KeyOp } from '../gen/types/KeyboardDefinition';
import KeyboardModel from '../models/KeyboardModel';
import { IAuth } from '../services/auth/Auth';
import { IOperationLogType, IStorage } from '../services/storage/Storage';

export const getEncoderIdList = (
  keymapDefinition: ((string | KeyOp)[] | { name: string })[]
): number[] => {
  const keyboardModel = new KeyboardModel(keymapDefinition);
  const keyModels = keyboardModel.keyModels;
  return keyModels.reduce<number[]>((result, keyModel) => {
    if (keyModel.isEncoder) {
      result.push(keyModel.encoderId!);
    }
    return result;
  }, []);
};

export const sendOperationLog = async (
  auth: IAuth,
  storage: IStorage,
  localAuthenticationUid: string,
  keyboardDefinitionId: string,
  operation: IOperationLogType
): Promise<void> => {
  let uid: string;
  const user = auth.getCurrentAuthenticatedUserOrNull();
  if (user === null) {
    uid = `local:${localAuthenticationUid}`;
  } else {
    uid = `firebase:${user.uid}`;
  }
  await storage.sendOperationLog(uid, keyboardDefinitionId, operation);
};
