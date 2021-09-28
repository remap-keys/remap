import {
  IConditionNotSelected,
  IKeyboardFeatures,
  RootState,
} from '../../../../store/state';
import { connect } from 'react-redux';
import CatalogForm from './CatalogForm';
import { KeyboardsEditDefinitionActions } from '../../../../actions/keyboards.actions';
import { storageActionsThunk } from '../../../../actions/storage.action';
import { IStore } from '../../../../services/storage/Storage';

const mapStateToProps = (state: RootState) => {
  return {
    definitionDocument: state.entities.keyboardDefinitionDocument,
    features: state.keyboards.editdefinition.features,
    mainImageUploadedRate: state.keyboards.editdefinition.mainImageUploadedRate,
    mainImageUploading: state.keyboards.editdefinition.mainImageUploading,
    subImageUploadedRate: state.keyboards.editdefinition.subImageUploadedRate,
    subImageUploading: state.keyboards.editdefinition.subImageUploading,
    description: state.keyboards.editdefinition.description,
    stores: state.keyboards.editdefinition.stores,
    websiteUrl: state.keyboards.editdefinition.websiteUrl,
    additionalDescriptions:
      state.keyboards.editdefinition.additionalDescriptions,
  };
};
export type CatalogFormStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    updateFeature: (
      value: IKeyboardFeatures | IConditionNotSelected,
      targetFeatures: readonly IKeyboardFeatures[]
    ) => {
      _dispatch(
        KeyboardsEditDefinitionActions.updateFeature(value, targetFeatures)
      );
    },
    save: () => {
      _dispatch(storageActionsThunk.updateKeyboardDefinitionForCatalog());
    },
    uploadKeyboardCatalogImage: (definitionId: string, file: File) => {
      _dispatch(
        storageActionsThunk.uploadKeyboardCatalogImage(definitionId, file)
      );
    },
    updateDescription: (description: string) => {
      _dispatch(KeyboardsEditDefinitionActions.updateDescription(description));
    },
    updateStores: (stores: IStore[]) => {
      _dispatch(KeyboardsEditDefinitionActions.updateStores(stores));
      _dispatch(storageActionsThunk.updateKeyboardDefinitionForCatalog());
    },
    updateWebsiteUrl: (websiteUrl: string) => {
      _dispatch(KeyboardsEditDefinitionActions.updateWebsiteUrl(websiteUrl));
    },
    addAdditionalDescription: (title: string, body: string) => {
      _dispatch(
        KeyboardsEditDefinitionActions.addAdditionalDescription(title, body)
      );
    },
    deleteAdditionalDescription: (index: number) => {
      _dispatch(
        KeyboardsEditDefinitionActions.deleteAdditionalDescription(index)
      );
    },
    uploadKeyboardCatalogSubImage: (definitionId: string, file: File) => {
      _dispatch(
        storageActionsThunk.uploadKeyboardCatalogSubImage(definitionId, file)
      );
    },
    deleteSubImage: (definitionId: string, subImageIndex: number) => {
      _dispatch(
        storageActionsThunk.deleteKeyboardCatalogSubImage(
          definitionId,
          subImageIndex
        )
      );
    },
  };
};
export type CatalogFormActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(CatalogForm);
