import { connect } from 'react-redux';
import Catalog from './Catalog';
import {
  ALL_HOTSWAP_TYPE,
  ALL_KEY_COUNT_TYPE,
  ALL_KEY_SWITCH_TYPE,
  ALL_LED_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  ALL_WIRELESS_TYPE,
  ICatalogPhase,
  IKeyboardFeatures,
  IKeyboardHotswapType,
  IKeyboardKeyCountType,
  IKeyboardKeySwitchType,
  IKeyboardLedType,
  IKeyboardOledType,
  IKeyboardSpeakerType,
  IKeyboardSplitType,
  IKeyboardStaggeredType,
  IKeyboardWirelessType,
  RootState,
} from '../../store/state';
import {
  AppActions,
  AppActionsThunk,
  NotificationActions,
} from '../../actions/actions';
import {
  catalogActionsThunk,
  CatalogAppActions,
  CatalogSearchActions,
} from '../../actions/catalog.action';
import { storageActionsThunk } from '../../actions/storage.action';
import { ParsedQs } from 'qs';
import { MetaActions } from '../../actions/meta.action';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = (state: RootState) => {
  return {
    notifications: state.app.notifications,
    auth: state.auth.instance,
  };
};
export type CatalogStateType = ReturnType<typeof mapStateToProps>;

// eslint-disable-next-line no-unused-vars
const mapDispatchToProps = (dispatch: any) => {
  return {
    removeNotification: (key: string) => {
      dispatch(NotificationActions.removeNotification(key));
    },
    updateKeyboard: (definitionId: string, nextPhase: ICatalogPhase) => {
      dispatch(CatalogAppActions.updatePhase('processing'));
      dispatch(
        storageActionsThunk.fetchKeyboardDefinitionForCatalogById(
          definitionId,
          nextPhase
        )
      );
    },
    init: () => {
      dispatch(storageActionsThunk.fetchAllOrganizations());
      dispatch(storageActionsThunk.searchKeyboardsForCatalog());
    },
    applySharedKeymap: (definitionId: string, keymapId: string) => {
      dispatch(catalogActionsThunk.applySharedKeymap(definitionId, keymapId));
    },
    updateSignedIn: (signedIn: boolean) => {
      dispatch(AppActions.updateSignedIn(signedIn));
      dispatch(AppActionsThunk.updateUserInformation());
    },
    updateSearchCondition: (params: ParsedQs) => {
      if (params.keyword) {
        dispatch(CatalogSearchActions.updateKeyword(params.keyword as string));
      }
      if (params.organizationId) {
        dispatch(
          CatalogSearchActions.updateOrganizationId(
            params.organizationId as string
          )
        );
      }
      if (params.buildSupport) {
        dispatch(CatalogSearchActions.updateBuildSupport(true));
      }
      if (params.features) {
        (params.features as string).split(',').forEach((feature: string) => {
          if (ALL_KEY_COUNT_TYPE.includes(feature as IKeyboardKeyCountType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardKeyCountType,
                ALL_KEY_COUNT_TYPE
              )
            );
          }
          if (ALL_SPLIT_TYPE.includes(feature as IKeyboardSplitType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_SPLIT_TYPE
              )
            );
          }
          if (ALL_STAGGERED_TYPE.includes(feature as IKeyboardStaggeredType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_STAGGERED_TYPE
              )
            );
          }
          if (ALL_LED_TYPE.includes(feature as IKeyboardLedType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_LED_TYPE
              )
            );
          }
          if (ALL_KEY_SWITCH_TYPE.includes(feature as IKeyboardKeySwitchType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_KEY_SWITCH_TYPE
              )
            );
          }
          if (ALL_HOTSWAP_TYPE.includes(feature as IKeyboardHotswapType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_HOTSWAP_TYPE
              )
            );
          }
          if (ALL_OLED_TYPE.includes(feature as IKeyboardOledType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_OLED_TYPE
              )
            );
          }
          if (ALL_SPEAKER_TYPE.includes(feature as IKeyboardSpeakerType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_SPEAKER_TYPE
              )
            );
          }
          if (ALL_WIRELESS_TYPE.includes(feature as IKeyboardWirelessType)) {
            dispatch(
              CatalogSearchActions.updateFeatures(
                feature as IKeyboardFeatures,
                ALL_WIRELESS_TYPE
              )
            );
          }
        });
      }
    },
    initializeMeta: () => {
      dispatch(MetaActions.initialize());
    },
  };
};

export type CatalogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
