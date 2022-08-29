import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import {
  firmwareActionsThunk,
  UploadFirmwareDialogActions,
} from '../../../actions/firmware.action';
import UploadFirmwareDialog from './UploadFirmwareDialog';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    open: state.common.firmware.uploadFirmwareDialog.open,
  };
};
export type UploadFirmwareDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    close: () => {
      _dispatch(UploadFirmwareDialogActions.updateOpen(false));
    },
    uploadFirmwareFile: (file: File) => {
      _dispatch(firmwareActionsThunk.uploadFirmwareFile(file));
    },
  };
};
export type UploadFirmwareDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadFirmwareDialog);
