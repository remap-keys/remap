import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import OGP from './OGP';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    title: state.app.meta.title,
    description: state.app.meta.description,
    og: state.app.meta.og,
  };
};
export type OGPStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type OGPActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(OGP);
