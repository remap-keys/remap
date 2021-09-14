import React from 'react';
import {
  CatalogIntroductionActionsType,
  CatalogIntroductionStateType,
} from './CatalogIntroduction.container';
import './CatalogIntroduction.scss';
import { Grid, Link, Paper, Tab, Tabs, Typography } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import { CatalogKeyboardHeader } from './CatalogKeyboardHeader';
import TweetButton from '../../common/twitter/TweetButton';
import {
  IAdditionalDescription,
  IKeyboardDefinitionDocument,
} from '../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import FeatureList from '../../common/features/FeatureList';

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
      <div className="catalog-introduction-wrapper">
        <div className="catalog-introduction-container">
          <CatalogKeyboardHeader
            definitionDocument={this.props.definitionDocument!}
          />
          <Paper elevation={0} className="catalog-introduction-content">
            <Grid container>
              <Grid item sm={6} className="catalog-introduction-column">
                <ImageList
                  definitionDocument={this.props.definitionDocument!}
                />
                <section className="catalog-introduction-section">
                  <Typography variant="h2">Features</Typography>
                  <div className="catalog-introduction-chip-container">
                    <FeatureList
                      definitionId={this.props.definitionDocument!.id}
                      features={this.props.definitionDocument!.features}
                      size="medium"
                    />
                  </div>
                </section>
                <section className="catalog-introduction-section">
                  <Typography variant="h2">Stores</Typography>
                  {this.props.definitionDocument!.stores.length > 0 ? (
                    <div className="catalog-introduction-stores">
                      {this.props.definitionDocument!.stores.map(
                        (store, index) => {
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
                        }
                      )}
                    </div>
                  ) : (
                    <div>Not specified by the owner of this keyboard.</div>
                  )}
                </section>
                <section className="catalog-introduction-section">
                  <div className="catalog-introduction-share-buttons">
                    <TweetButton
                      url={`https://remap-keys.app/catalog/${
                        this.props.definitionDocument!.id
                      }`}
                    />
                  </div>
                </section>
                {this.props.sameAuthorKeyboardDocuments!.length > 1 ? (
                  <section className="catalog-introduction-section">
                    <Typography variant="h2">
                      Created by Same Designer
                    </Typography>
                    {this.props
                      .sameAuthorKeyboardDocuments!.filter(
                        (definition) =>
                          definition.id !== this.props.definitionDocument!.id
                      )
                      .map((definition, index) => (
                        <Paper
                          key={`same-author-keyboard-${index}`}
                          elevation={0}
                          className="catalog-introduction-same-author-keyboard"
                          onClick={() => {
                            this.onClickSameAuthorKeyboard(definition);
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
                            <div className="catalog-introduction-same-author-keyboard-no-image" />
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
                ) : null}
              </Grid>
              <Grid item sm={6} className="catalog-introduction-column">
                <section className="catalog-introduction-section">
                  <div className="catalog-introduction-description-tab">
                    <DescriptionTab
                      additionalDescriptions={
                        this.props.definitionDocument!.additionalDescriptions
                      }
                      selectedTabIndex={this.state.selectedDescriptionTabIndex}
                      onChangeTab={this.onChangeSelectedDescriptionTabIndex.bind(
                        this
                      )}
                    />
                  </div>
                  {this.state.selectedDescriptionTabIndex === 0 ? (
                    <Typography variant="body1">
                      {convertStringToNodeList(
                        this.props.definitionDocument!.description
                      )}
                    </Typography>
                  ) : (
                    <Typography variant="body1">
                      {convertStringToNodeList(
                        this.props.definitionDocument!.additionalDescriptions[
                          this.state.selectedDescriptionTabIndex - 1
                        ].body
                      )}
                    </Typography>
                  )}
                </section>
              </Grid>
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
