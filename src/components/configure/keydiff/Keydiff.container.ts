import { connect } from 'react-redux';
import Keydiff from './Keydiff';
import { RootState } from '../../../store/state';

const mapStateToProps = (state: RootState) => {
  return {
    origin: state.keydiff.origin,
    destination: state.keydiff.destination,
  };
};
export type KeydiffStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {};
export type KeydiffActionsType = typeof mapStateToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Keydiff);
