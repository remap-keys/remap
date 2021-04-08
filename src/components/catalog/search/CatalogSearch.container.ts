import { connect } from 'react-redux';
import { RootState } from '../../../store/state';
import CatalogSearch from './CatalogSearch';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {};
};
export type CatalogSearchStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};
export type CatalogSearchActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogSearch);
