import { KeyOp } from '../gen/types/KeyboardDefinition';
import KeyboardModel from '../models/KeyboardModel';

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
