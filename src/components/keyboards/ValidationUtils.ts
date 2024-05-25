import { FirmwareCodePlace, IFirmwareCodePlace } from '../../store/state';

export const isQmkFirmwareCode = (
  firmwareCodePlace: IFirmwareCodePlace | undefined,
): boolean => {
  return firmwareCodePlace === FirmwareCodePlace.qmk;
};

export const isForkedQmkFirmwareCode = (
  firmwareCodePlace: IFirmwareCodePlace | undefined,
): boolean => {
  return firmwareCodePlace === FirmwareCodePlace.forked;
};

export const isOtherFirmwareCode = (
  firmwareCodePlace: IFirmwareCodePlace | undefined,
): boolean => {
  return firmwareCodePlace === FirmwareCodePlace.other;
};
