import { connect } from 'react-redux';
import KeymapSaveDialog from './KeymapSaveDialog';
import { RootState } from '../../../store/state';
import { LayoutOptionsActions } from '../../../actions/actions';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    keymaps: state.entities.device.keymaps,
    labelLang: state.app.labelLang,
    layerCount: state.entities.device.layerCount,
    layoutLabels: state.entities.keyboardDefinition?.layouts.labels,
    selectedLayoutOptions: state.configure.layoutOptions.selectedOptions,
  };
};
export type KeymapSaveDialogStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    setLayoutOption: (optionIndex: number, option: string | null) => {
      _dispatch(LayoutOptionsActions.updateSelectedOption(optionIndex, option));
    },
  };
};

export type KeymapSaveDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapSaveDialog);
