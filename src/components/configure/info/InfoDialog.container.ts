import { connect } from 'react-redux';
import InfoDialog from './InfoDialog';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    keyboardDefinition: state.entities.keyboardDefinition,
    keyboardDefinitionDocument: state.entities.keyboardDefinitionDocument,
    auth: state.auth.instance,
    organization: state.entities.organization,
    viaProtocolVersion: state.entities.device.viaProtocolVersion,
  };
};
export type InfoDialogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type InfoDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(InfoDialog);
