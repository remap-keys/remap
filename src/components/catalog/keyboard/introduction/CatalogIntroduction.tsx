import React from 'react';
import {
  CatalogIntroductionActionsType,
  CatalogIntroductionStateType,
} from './CatalogIntroduction.container';
import './CatalogIntroduction.scss';
import { Grid, Link, Paper, Tab, Tabs, Typography } from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import {
  IAdditionalDescription,
  IKeyboardDefinitionDocument,
} from '../../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../../utils/GoogleAnalytics';
import FeatureList from '../../../common/features/FeatureList';
import { isSmallDisplay } from '../../../../utils/DisplayUtils';

type CatalogIntroductionState = {
  selectedDescriptionTabIndex: number;
};
type OwnProps = {};
type CatalogIntroductionProps = OwnProps &
  Partial<CatalogIntroductionActionsType> &
  Partial<CatalogIntroductionStateType>;

export default class CatalogIntroduction extends React.Component<
  CatalogIntroductionProps,
  CatalogIntroductionState
> {
  constructor(
    props: CatalogIntroductionProps | Readonly<CatalogIntroductionProps>
  ) {
    super(props);
    this.state = {
      selectedDescriptionTabIndex: 0,
    };
  }

  onChangeSelectedDescriptionTabIndex(tabIndex: number) {
    this.setState({ selectedDescriptionTabIndex: tabIndex });
  }

  onClickSameAuthorKeyboard(definition: IKeyboardDefinitionDocument) {
    sendEventToGoogleAnalytics('catalog/same_author_keyboard');
    location.href = `/catalog/${definition.id}`;
  }

  render() {
    return (
      <div className="catalog-introduction-wrapper">
        <div className="catalog-introduction-container">
          <Paper elevation={0} className="catalog-introduction-content">
            <Grid container>
              {isSmallDisplay() ? (
                <Grid item sm={12} className="catalog-introduction-column">
                  <ImageList
                    definitionDocument={this.props.definitionDocument!}
                  />
                  <DescriptionSection
                    definitionDocument={this.props.definitionDocument!}
                    selectedDescriptionTabIndex={
                      this.state.selectedDescriptionTabIndex
                    }
                    onChangeSelectedDescriptionTabIndex={this.onChangeSelectedDescriptionTabIndex.bind(
                      this
                    )}
                  />
                  <FeaturesSection
                    definitionDocument={this.props.definitionDocument!}
                  />
                  <StoresSection
                    definitionDocument={this.props.definitionDocument!}
                  />
                  <SameAuthorKeyboardsSection
                    sameAuthorKeyboardDocuments={
                      this.props.sameAuthorKeyboardDocuments!
                    }
                    definitionDocument={this.props.definitionDocument!}
                    onClickSameAuthorKeyboard={this.onClickSameAuthorKeyboard.bind(
                      this
                    )}
                  />
                </Grid>
              ) : (
                <React.Fragment>
                  <Grid item sm={6} className="catalog-introduction-column">
                    <ImageList
                      definitionDocument={this.props.definitionDocument!}
                    />
                    <FeaturesSection
                      definitionDocument={this.props.definitionDocument!}
                    />
                    <StoresSection
                      definitionDocument={this.props.definitionDocument!}
                    />
                    <SameAuthorKeyboardsSection
                      sameAuthorKeyboardDocuments={
                        this.props.sameAuthorKeyboardDocuments!
                      }
                      definitionDocument={this.props.definitionDocument!}
                      onClickSameAuthorKeyboard={this.onClickSameAuthorKeyboard.bind(
                        this
                      )}
                    />
                  </Grid>
                  <Grid item sm={6} className="catalog-introduction-column">
                    <DescriptionSection
                      definitionDocument={this.props.definitionDocument!}
                      selectedDescriptionTabIndex={
                        this.state.selectedDescriptionTabIndex
                      }
                      onChangeSelectedDescriptionTabIndex={this.onChangeSelectedDescriptionTabIndex.bind(
                        this
                      )}
                    />
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </Paper>
        </div>
      </div>
    );
  }
}

type DescriptionTabProps = {
  additionalDescriptions: IAdditionalDescription[];
  selectedTabIndex: number;
  // eslint-disable-next-line no-unused-vars
  onChangeTab: (tabIndex: number) => void;
};

function DescriptionTab(props: DescriptionTabProps) {
  const onChangeTab = (event: React.ChangeEvent<{}>, value: number) => {
    props.onChangeTab(value);
  };
  if (props.additionalDescriptions.length > 0) {
    return (
      <Tabs
        value={props.selectedTabIndex}
        indicatorColor="primary"
        variant="scrollable"
        onChange={onChangeTab}
      >
        <Tab label="Default" />
        {props.additionalDescriptions.map((additionalDescription, index) => (
          <Tab
            label={additionalDescription.title}
            key={`additional-description-${index}`}
          />
        ))}
      </Tabs>
    );
  } else {
    return null;
  }
}

type ImageListProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

function ImageList(props: ImageListProps) {
  const hasImage = Boolean(props.definitionDocument.imageUrl);
  const images = [];
  if (hasImage) {
    images.push({
      original: props.definitionDocument.imageUrl,
      thumbnail: props.definitionDocument.thumbnailImageUrl,
    });
    props.definitionDocument.subImages.forEach((img) => {
      images.push({
        original: img.image_url,
        thumbnail: img.thumbnail_image_url,
      });
    });
  }

  return (
    <div className="catalog-introduction-image">
      {hasImage ? (
        <React.Fragment>
          <ImageGallery
            items={images}
            showFullscreenButton={false}
            showNav={false}
            showPlayButton={false}
          />
        </React.Fragment>
      ) : (
        <div className="catalog-introduction-image-nothing">
          <PhotoLibraryIcon />
          No Image
        </div>
      )}
    </div>
  );
}

type FeaturesSectionProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

function FeaturesSection(props: FeaturesSectionProps) {
  return (
    <section className="catalog-introduction-section">
      <Typography variant="h2">Features</Typography>
      <div className="catalog-introduction-chip-container">
        <FeatureList
          features={props.definitionDocument.features}
          size="medium"
        />
      </div>
    </section>
  );
}

type StoresSectionProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

function StoresSection(props: StoresSectionProps) {
  return (
    <section className="catalog-introduction-section">
      <Typography variant="h2">Stores</Typography>
      {props.definitionDocument.stores.length > 0 ? (
        <div className="catalog-introduction-stores">
          {props.definitionDocument.stores.map((store, index) => {
            return (
              <Typography key={index} variant="body1">
                <Link
                  href={store.url}
                  target="_blank"
                  rel="noreferrer"
                  className="catalog-introduction-store"
                >
                  {store.name}
                </Link>
              </Typography>
            );
          })}
        </div>
      ) : (
        <div>Not specified by the owner of this keyboard.</div>
      )}
    </section>
  );
}

type SameAuthorKeyboardsSectionProps = {
  sameAuthorKeyboardDocuments: IKeyboardDefinitionDocument[];
  definitionDocument: IKeyboardDefinitionDocument;
  // eslint-disable-next-line no-unused-vars
  onClickSameAuthorKeyboard: (definition: IKeyboardDefinitionDocument) => void;
};

function SameAuthorKeyboardsSection(props: SameAuthorKeyboardsSectionProps) {
  if (props.sameAuthorKeyboardDocuments.length > 1) {
    return (
      <section className="catalog-introduction-section">
        <Typography variant="h2">Created by Same Designer</Typography>
        {props.sameAuthorKeyboardDocuments
          .filter(
            (definition) => definition.id !== props.definitionDocument!.id
          )
          .map((definition, index) => (
            <Paper
              key={`same-author-keyboard-${index}`}
              elevation={0}
              className="catalog-introduction-same-author-keyboard"
              onClick={() => {
                props.onClickSameAuthorKeyboard(definition);
              }}
            >
              {definition.imageUrl ? (
                <div
                  className="catalog-introduction-same-author-keyboard-image"
                  style={{
                    backgroundImage: `url('${definition.imageUrl}')`,
                  }}
                />
              ) : (
                <div className="catalog-introduction-same-author-keyboard-no-image">
                  <PhotoLibraryIcon />
                  No Image
                </div>
              )}
              <Typography
                variant="subtitle1"
                className="catalog-introduction-same-author-keyboard-name"
              >
                {definition.name}
              </Typography>
            </Paper>
          ))}
      </section>
    );
  } else {
    return null;
  }
}

type DescriptionSectionProps = {
  definitionDocument: IKeyboardDefinitionDocument;
  selectedDescriptionTabIndex: number;
  // eslint-disable-next-line no-unused-vars
  onChangeSelectedDescriptionTabIndex: (tabIndex: number) => void;
};

function DescriptionSection(props: DescriptionSectionProps) {
  const convertStringToNodeList = (
    source: string
  ): React.ReactNode[] | string => {
    if (source) {
      return source.split(/(\n)/).map((item: string, index: number) => {
        return (
          <React.Fragment key={index}>
            {item.match(/\n/) ? <br /> : item}
          </React.Fragment>
        );
      });
    } else {
      return 'A description is not specified by the owner of this keyboard.';
    }
  };

  return (
    <section className="catalog-introduction-section">
      <div className="catalog-introduction-description-tab">
        <DescriptionTab
          additionalDescriptions={
            props.definitionDocument.additionalDescriptions
          }
          selectedTabIndex={props.selectedDescriptionTabIndex}
          onChangeTab={props.onChangeSelectedDescriptionTabIndex}
        />
      </div>
      {props.selectedDescriptionTabIndex === 0 ? (
        <Typography variant="body1">
          {convertStringToNodeList(props.definitionDocument.description)}
        </Typography>
      ) : (
        <Typography variant="body1">
          {convertStringToNodeList(
            props.definitionDocument.additionalDescriptions[
              props.selectedDescriptionTabIndex - 1
            ].body
          )}
        </Typography>
      )}
    </section>
  );
}
