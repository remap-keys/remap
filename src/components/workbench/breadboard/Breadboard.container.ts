import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Breadboard from './Breadboard';

const mapStateToProps = (state: RootState) => {
  return {
    projects: state.workbench.app.projects,
    currentProject: state.workbench.app.currentProject,
  };
};
export type BreadboardStateType = ReturnType<typeof mapStateToProps>;

/* eslint-disable-next-line no-unused-vars */
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type BreadboardActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Breadboard);
