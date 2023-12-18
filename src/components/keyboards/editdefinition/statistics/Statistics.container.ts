import { RootState } from '../../../../store/state';
import { connect } from 'react-redux';
import Statistics from './Statistics';

const mapStateToProps = (state: RootState) => {
  return {
    statistics: state.keyboards.editdefinition.keyboardStatistics,
  };
};
export type StatisticsStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type StatisticsActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
