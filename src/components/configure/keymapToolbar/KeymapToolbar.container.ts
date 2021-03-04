import { connect } from 'react-redux';
import KeymapToolbar from './KeymapToolbar';
import { RootState } from '../../../store/state';
import { AppActions, KeydiffActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    keyboardDefinition: state.entities.keyboardDefinition,
    keymaps: state.entities.device.keymaps,
    layerCount: state.entities.device.layerCount,
    selectedKeyboardOptions: state.configure.layoutOptions.selectedOptions,
    labelLang: state.app.labelLang,
    remaps: state.app.remaps,
  };
};
export type KeymapMenuStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {
    clearAllRemaps: (layerCount: number) => {
      _dispatch(AppActions.remapsInit(layerCount));
      _dispatch(KeydiffActions.clearKeydiff());
    },
  };
};

export type KeymapMenuActionsType = ReturnType<typeof mapDispatchToProps>;
export default connect(mapStateToProps, mapDispatchToProps)(KeymapToolbar);
