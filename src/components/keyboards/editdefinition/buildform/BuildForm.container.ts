import { RootState } from '../../../../store/state';
import { connect } from 'react-redux';
import BuildForm from './BuildForm';

const mapStateToProps = (state: RootState) => {
  return {
    buildableFirmware: state.entities.buildableFirmware,
    buildableFirmwareKeyboardFiles:
      state.entities.buildableFirmwareKeyboardFiles,
    buildableFirmwareKeymapFiles: state.entities.buildableFirmwareKeymapFiles,
  };
};
export type BuildFormStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type BuildFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(BuildForm);
