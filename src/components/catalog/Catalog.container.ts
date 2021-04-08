import { connect } from 'react-redux';
import Catalog from './Catalog';
import { RootState } from '../../store/state';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {};
};
export type CatalogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (_dispatch: any) => {
  return {};
};

export type CatalogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
