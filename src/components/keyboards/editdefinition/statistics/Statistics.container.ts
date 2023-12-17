import { RootState } from '../../../../store/state';
import { connect } from 'react-redux';
import Statistics from './Statistics';

const mapStateToProps = (state: RootState) => {
  return {};
};
export type StatisticsStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type StatisticsActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
