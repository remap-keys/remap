import { connect } from 'react-redux';
import KeymapMenu from './KeymapMenu';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    keyboardDefinition: state.entities.keyboardDefinition,
    keymaps: state.entities.device.keymaps,
    layerCount: state.entities.device.layerCount,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    labelLang: state.app.labelLang,
  };
};
export type KeymapMenuStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type KeymapMenuActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(KeymapMenu);
