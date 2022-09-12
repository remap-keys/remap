import { connect } from 'react-redux';
import TabKey from './TabKey';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    macroBufferBytes: state.entities.device.macro.bufferBytes,
    macroMaxBufferSize: state.entities.device.macro.maxBufferSize,
    macroMaxCount: state.entities.device.macro.maxCount,
    keyboardDefinition: state.entities.keyboardDefinition,
  };
};
export type TabKeyStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type TabKeyActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(TabKey);
