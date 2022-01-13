import React, { useState } from 'react';
import './CatalogForm.scss';
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import {
  ALL_HOTSWAP_TYPE,
  ALL_OLED_TYPE,
  ALL_SPEAKER_TYPE,
  ALL_SPLIT_TYPE,
  ALL_STAGGERED_TYPE,
  ALL_WIRELESS_TYPE,
  CONDITION_NOT_SELECTED,
  IKeyboardFeatures,
} from '../../../../store/state';
import {
  CatalogFormActionsType,
  CatalogFormStateType,
} from './CatalogForm.container';
import { Delete } from '@mui/icons-material';
import StoreAddDialog from './StoreAddDialog';
import { IStore, ISubImage } from '../../../../services/storage/Storage';
import CircularProgressWithLabel from '../../../common/circularprogress/CircularProgressWithLabel';

type OwnProps = {};
type CatalogFormProps = OwnProps &
  Partial<CatalogFormActionsType> &
  Partial<CatalogFormStateType>;

export default function CatalogForm(props: CatalogFormProps) {
  const dropTargetRef = React.createRef<HTMLDivElement>();

  const [mainImageDragging, setMainImageDragging] = useState<boolean>(false);
  const [subImageDragging, setSubImageDragging] = useState<boolean>(false);
  const [openStoreAddDialog, setOpenStoreAddDialog] = useState<boolean>(false);
  const [
    additionalDescriptionTitle,
    setAdditionalDescriptionTitle,
  ] = useState<string>('');
  const [
    additionalDescriptionBody,
    setAdditionalDescriptionBody,
  ] = useState<string>('');

  const getFeatureValue = (features: readonly string[]): string => {
    for (const feature of props.features!) {
      if (features.includes(feature)) {
        return feature;
      }
    }
    return CONDITION_NOT_SELECTED;
  };

  const hasFeatureValue = (feature: IKeyboardFeatures): boolean => {
    return props.features!.includes(feature);
  };

  const onChangeKeyCount = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    value: IKeyboardFeatures
  ): void => {
    props.updateFeature!(checked ? value : CONDITION_NOT_SELECTED, [value]);
  };

  const onChangeKeyboardType = (
    event: SelectChangeEvent,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_SPLIT_TYPE
    );
  };

  const onChangeKeyLayout = (
    event: SelectChangeEvent,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_STAGGERED_TYPE
    );
  };

  const onChangeBacklight = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'backlight' : CONDITION_NOT_SELECTED, [
      'backlight',
    ]);
  };

  const onChangeUnderglow = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'underglow' : CONDITION_NOT_SELECTED, [
      'underglow',
    ]);
  };

  const onChangeCherryMx = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'cherry_mx' : CONDITION_NOT_SELECTED, [
      'cherry_mx',
    ]);
  };

  const onChangeKailhChocV1 = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'kailh_choc' : CONDITION_NOT_SELECTED, [
      'kailh_choc',
    ]);
  };

  const onChangeKailhChocV2 = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'kailh_choc_v2' : CONDITION_NOT_SELECTED, [
      'kailh_choc_v2',
    ]);
  };

  const onChangeKailhMidHeight = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(
      checked ? 'kailh_mid_height' : CONDITION_NOT_SELECTED,
      ['kailh_mid_height']
    );
  };

  const onChangeAlps = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'alps' : CONDITION_NOT_SELECTED, ['alps']);
  };

  const onChangeOutemuLP = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ): void => {
    props.updateFeature!(checked ? 'outemulp' : CONDITION_NOT_SELECTED, [
      'outemulp',
    ]);
  };

  const onChangeCapacitiveSensingType = (
    event: SelectChangeEvent,
    checked: boolean
  ): void => {
    props.updateFeature!(
      checked ? 'capacitive_sensing_type' : CONDITION_NOT_SELECTED,
      ['capacitive_sensing_type']
    );
  };

  const onChangeHotSwap = (
    event: SelectChangeEvent,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_HOTSWAP_TYPE
    );
  };

  const onChangeOled = (
    event: SelectChangeEvent,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_OLED_TYPE
    );
  };

  const onChangeSpeaker = (
    event: SelectChangeEvent,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_SPEAKER_TYPE
    );
  };

  const onChangeWireless = (
    event: SelectChangeEvent,
    // eslint-disable-next-line no-unused-vars
    child: React.ReactNode
  ): void => {
    props.updateFeature!(
      event.target.value as IKeyboardFeatures,
      ALL_WIRELESS_TYPE
    );
  };

  const onClickSave = (): void => {
    props.save!();
  };

  const onDragOverMainImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMainImageDragging(true);
  };

  const onDragLeaveMainImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMainImageDragging(false);
  };

  const onDropMainImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMainImageDragging(false);
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    props.uploadKeyboardCatalogImage!(props.definitionDocument!.id, file);
  };

  const onDragOverSubImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setSubImageDragging(true);
  };

  const onDragLeaveSubImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setSubImageDragging(false);
  };

  const onDropSubImageFile = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setSubImageDragging(false);
    const files = event.dataTransfer.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    props.uploadKeyboardCatalogSubImage!(props.definitionDocument!.id, file);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value;
    props.updateDescription!(description);
  };

  // eslint-disable-next-line no-unused-vars
  const onClickAddStore = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenStoreAddDialog(true);
  };

  const onCloseStoreAddDialog = () => {
    setOpenStoreAddDialog(false);
  };

  const onAddStore = (name: string, url: string) => {
    const filtered = props.stores!.filter((store) => store.name !== name);
    filtered.push({
      name,
      url,
    });
    props.updateStores!(filtered);
  };

  const onClickDeleteStore = (store: IStore) => {
    const filtered = props.stores!.filter((x) => x.name !== store.name);
    props.updateStores!(filtered);
  };

  const onChangeWebsiteUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const websiteUrl = event.target.value;
    props.updateWebsiteUrl!(websiteUrl);
  };

  const onChangeAdditionalDescriptionTitle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdditionalDescriptionTitle(event.target.value);
  };

  const onChangeAdditionalDescriptionBody = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdditionalDescriptionBody(event.target.value);
  };

  const onClickAdditionalDescriptionDelete = (index: number) => {
    const additionalDescription = props.additionalDescriptions![index];
    props.deleteAdditionalDescription!(index);
    setAdditionalDescriptionTitle(additionalDescription.title);
    setAdditionalDescriptionBody(additionalDescription.body);
  };

  // eslint-disable-next-line no-unused-vars
  const onClickAdditionalDescriptionAdd = (event: React.SyntheticEvent) => {
    props.addAdditionalDescription!(
      additionalDescriptionTitle,
      additionalDescriptionBody
    );
    setAdditionalDescriptionTitle('');
    setAdditionalDescriptionBody('');
  };

  const onDeleteSubImage = (subImageIndex: number) => {
    props.deleteSubImage!(props.definitionDocument!.id, subImageIndex);
  };

  return (
    <div className="edit-definition-catalog-form-container">
      <div className="edit-definition-catalog-form">
        <div className="edit-definition-catalog-form-section">
          <TextField
            label="Name"
            variant="outlined"
            value={props.definitionDocument!.name || ''}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="edit-definition-catalog-form-section">
          <Card variant="outlined">
            <CardContent>
              <div className="edit-definition-catalog-form-upload-image-form">
                {props.mainImageUploading ? (
                  <div className="edit-definition-catalog-form-upload-image-form-progress">
                    <CircularProgressWithLabel
                      value={props.mainImageUploadedRate!}
                    />
                  </div>
                ) : (
                  <React.Fragment>
                    <div
                      className={
                        mainImageDragging
                          ? 'edit-definition-catalog-form-upload-image-form-area edit-definition-catalog-form-upload-image-form-area-active'
                          : 'edit-definition-catalog-form-upload-image-form-area'
                      }
                      onDragOver={onDragOverMainImageFile}
                      onDrop={onDropMainImageFile}
                      onDragLeave={onDragLeaveMainImageFile}
                    >
                      <div
                        className="edit-definition-catalog-form-upload-image-form-message"
                        ref={dropTargetRef}
                      >
                        Drop Main Image here
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <div
                  className="edit-definition-catalog-form-upload-image-form-image"
                  style={{
                    backgroundImage: `url(${
                      props.definitionDocument!.imageUrl
                    })`,
                  }}
                />
              </div>
              <div className="edit-definition-catalog-form-upload-image-form">
                {props.subImageUploading ? (
                  <div className="edit-definition-catalog-form-upload-image-form-progress">
                    <CircularProgressWithLabel
                      value={props.subImageUploadedRate!}
                    />
                  </div>
                ) : (
                  <React.Fragment>
                    <div
                      className={
                        subImageDragging
                          ? 'edit-definition-catalog-form-upload-image-form-area edit-definition-catalog-form-upload-image-form-area-active'
                          : 'edit-definition-catalog-form-upload-image-form-area'
                      }
                      onDragOver={onDragOverSubImageFile}
                      onDrop={onDropSubImageFile}
                      onDragLeave={onDragLeaveSubImageFile}
                    >
                      <div
                        className="edit-definition-catalog-form-upload-image-form-message"
                        ref={dropTargetRef}
                      >
                        Drop Sub Image here
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <SubImageList
                  subImages={props.definitionDocument!.subImages}
                  onDeleteSubImage={onDeleteSubImage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="edit-definition-catalog-form-section">
          <Card variant="outlined">
            <CardContent>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <TextField
                    label="Description (Default)"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={props.description}
                    onChange={onChangeDescription}
                  />
                </FormControl>
              </div>
              {props.additionalDescriptions!.map((item, index) => (
                <div
                  className="edit-definition-catalog-form-row"
                  key={`additional-description-${index}`}
                >
                  <FormControl>
                    <div className="edit-definition-catalog-form-additional-description-entry">
                      <TextField
                        className="edit-definition-catalog-form-additional-description-entry-field"
                        label={`Additional Description (${item.title})`}
                        multiline
                        rows={4}
                        value={item.body}
                        onChange={onChangeDescription}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <div>
                        <IconButton
                          aria-label="Delete this additional description"
                          onClick={() => {
                            onClickAdditionalDescriptionDelete(index);
                          }}
                          edge="end"
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </div>
                  </FormControl>
                </div>
              ))}
              <Paper
                variant="outlined"
                className="edit-definition-catalog-form-additional-description"
              >
                <div className="edit-definition-catalog-form-additional-description-row">
                  <FormControl>
                    <TextField
                      label="Additional Description Title"
                      value={additionalDescriptionTitle}
                      onChange={onChangeAdditionalDescriptionTitle}
                    />
                  </FormControl>
                </div>
                <div className="edit-definition-catalog-form-additional-description-row">
                  <FormControl>
                    <TextField
                      label="Additional Description Body"
                      multiline
                      rows={4}
                      value={additionalDescriptionBody}
                      onChange={onChangeAdditionalDescriptionBody}
                    />
                    <div className="edit-definition-catalog-form-additional-description-row-buttons">
                      <Button
                        variant="contained"
                        onClick={onClickAdditionalDescriptionAdd}
                        disabled={
                          !(
                            !!additionalDescriptionTitle &&
                            !!additionalDescriptionBody
                          )
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </FormControl>
                </div>
              </Paper>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <TextField
                    label="Keyboard Website URL"
                    variant="outlined"
                    value={props.websiteUrl}
                    onChange={onChangeWebsiteUrl}
                  />
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Number of Keys</FormLabel>
                  <FormGroup row>
                    {[
                      ['over_100', 'Over 100%'],
                      ['100', '100%'],
                      ['90', '90%'],
                      ['80', '80%'],
                      ['70', '70%'],
                      ['60', '60%'],
                      ['50', '50%'],
                      ['40', '40%'],
                      ['30', '30%'],
                      ['macro', 'Macro'],
                    ].map((data) => {
                      const [value, label] = data;
                      return (
                        <FormControlLabel
                          key={value}
                          control={
                            <Checkbox
                              value={value}
                              checked={hasFeatureValue(
                                value as IKeyboardFeatures
                              )}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                                checked: boolean
                              ) => {
                                onChangeKeyCount(
                                  event,
                                  checked,
                                  value as IKeyboardFeatures
                                );
                              }}
                            />
                          }
                          label={label}
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Keyboard Type</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_SPLIT_TYPE)}
                    onChange={onChangeKeyboardType}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="integrated">Integrated</MenuItem>
                    <MenuItem value="split">Split</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Key Layout</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_STAGGERED_TYPE)}
                    onChange={onChangeKeyLayout}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="column_staggered">
                      Column Staggered
                    </MenuItem>
                    <MenuItem value="row_staggered">Row Staggered</MenuItem>
                    <MenuItem value="ortholinear">Ortholinear</MenuItem>
                    <MenuItem value="symmetrical">Symmetrical</MenuItem>
                    <MenuItem value="alice">Alice</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Lighting</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="backlight"
                          checked={hasFeatureValue('backlight')}
                          onChange={onChangeBacklight}
                        />
                      }
                      label="Backlight LED"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="underglow"
                          checked={hasFeatureValue('underglow')}
                          onChange={onChangeUnderglow}
                        />
                      }
                      label="Underglow LED"
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Key Switch</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="cherryMx"
                          checked={hasFeatureValue('cherry_mx')}
                          onChange={onChangeCherryMx}
                        />
                      }
                      label="Cherry MX Compatible"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="kailhChocV1"
                          checked={hasFeatureValue('kailh_choc')}
                          onChange={onChangeKailhChocV1}
                        />
                      }
                      label="Kailh Choc V1"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="kailhChocV2"
                          checked={hasFeatureValue('kailh_choc_v2')}
                          onChange={onChangeKailhChocV2}
                        />
                      }
                      label="Kailh Choc V2"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="kailhMidHeight"
                          checked={hasFeatureValue('kailh_mid_height')}
                          onChange={onChangeKailhMidHeight}
                        />
                      }
                      label="Kailh Mid-height"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="alps"
                          checked={hasFeatureValue('alps')}
                          onChange={onChangeAlps}
                        />
                      }
                      label="ALPS"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="outemulp"
                          checked={hasFeatureValue('outemulp')}
                          onChange={onChangeOutemuLP}
                        />
                      }
                      label="Outemu Low Profile"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="capacitiveSensingType"
                          checked={hasFeatureValue('capacitive_sensing_type')}
                          onChange={onChangeCapacitiveSensingType}
                        />
                      }
                      label="Capacitive Sensing Type"
                    />
                  </FormGroup>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Hot Swap</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_HOTSWAP_TYPE)}
                    onChange={onChangeHotSwap}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="hot_swap">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">OLED</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_OLED_TYPE)}
                    onChange={onChangeOled}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="oled">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Speaker</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_SPEAKER_TYPE)}
                    onChange={onChangeSpeaker}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="speaker">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-row">
                <FormControl>
                  <FormLabel component="legend">Wireless</FormLabel>
                  <Select
                    value={getFeatureValue(ALL_WIRELESS_TYPE)}
                    onChange={onChangeWireless}
                  >
                    <MenuItem value="---">---</MenuItem>
                    <MenuItem value="wireless">Supported</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="edit-definition-catalog-form-buttons">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: '16px' }}
                  onClick={onClickSave}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="edit-definition-catalog-form-section">
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">Stores</Typography>
              <List>
                {props.stores!.map((store, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={store.name}
                      secondary={
                        <a href={store.url} target="_blank" rel="noreferrer">
                          {store.url}
                        </a>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        // eslint-disable-next-line no-unused-vars
                        onClick={(event: React.MouseEvent) => {
                          onClickDeleteStore(store);
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <div className="edit-definition-catalog-form-store-form">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onClickAddStore}
                >
                  Add
                </Button>
                <StoreAddDialog
                  open={openStoreAddDialog}
                  onClose={onCloseStoreAddDialog}
                  onAdd={onAddStore}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

type SubImageListProps = {
  subImages: ISubImage[];
  // eslint-disable-next-line no-unused-vars
  onDeleteSubImage: (subImageIndex: number) => void;
};

function SubImageList(props: SubImageListProps) {
  return (
    <React.Fragment>
      {props.subImages.length > 0 ? (
        <SubImage
          subImageIndex={0}
          imageUrl={props.subImages[0].image_url}
          onDeleteSubImage={props.onDeleteSubImage}
        />
      ) : (
        <div className="edit-definition-catalog-form-upload-image-form-image" />
      )}
      {props.subImages.length > 1 ? (
        <SubImage
          subImageIndex={1}
          imageUrl={props.subImages[1].image_url}
          onDeleteSubImage={props.onDeleteSubImage}
        />
      ) : (
        <div className="edit-definition-catalog-form-upload-image-form-image" />
      )}
      {props.subImages.length > 2 ? (
        <SubImage
          subImageIndex={2}
          imageUrl={props.subImages[2].image_url}
          onDeleteSubImage={props.onDeleteSubImage}
        />
      ) : (
        <div className="edit-definition-catalog-form-upload-image-form-image" />
      )}
    </React.Fragment>
  );
}

type SubImageProps = {
  subImageIndex: number;
  imageUrl: string;
  // eslint-disable-next-line no-unused-vars
  onDeleteSubImage: (subImageIndex: number) => void;
};

function SubImage(props: SubImageProps) {
  const [entered, setEntered] = useState<boolean>(false);

  const onClickDeleteSubImage = () => {
    props.onDeleteSubImage(props.subImageIndex);
  };

  return (
    <div
      className="edit-definition-catalog-form-upload-image-form-sub-image"
      style={{
        backgroundImage: `url(${props.imageUrl})`,
      }}
      onMouseEnter={() => {
        setEntered(true);
      }}
      onMouseLeave={() => {
        setEntered(false);
      }}
    >
      {entered ? (
        <div
          className="edit-definition-catalog-form-upload-image-form-sub-image-wrapper"
          onClick={() => {
            onClickDeleteSubImage();
          }}
        >
          <Delete />
        </div>
      ) : null}
    </div>
  );
}
