import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import Footer from './Footer';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    buildNumber: state.app.buildNumber,
  };
};
export type FooterStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type FooterActionsType = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
