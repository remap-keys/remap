import { connect } from 'react-redux';
import KeymapListPopover from './KeymapListPopover';
import { RootState } from '../../../store/state';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {};
};
export type KeymapListPopoverStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type KeymapListPopoverActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapListPopover);
