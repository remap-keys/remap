import './CatalogIntroduction.scss';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import {
  CatalogIntroductionActionsType,
  CatalogIntroductionStateType,
} from './CatalogIntroduction.container';
import {
  Button,
  Chip,
  Grid,
  Link,
  MobileStepper,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { IKeyboardFeatures } from '../../../store/state';
import { CatalogKeyboardHeader } from './CatalogKeyboardHeader';
import TweetButton from '../../common/twitter/TweetButton';
import {
  IAdditionalDescription,
  IKeyboardDefinitionDocument,
} from '../../../services/storage/Storage';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const featureMap: { [p: string]: { [p: string]: string } } = {
  over_100: {
    label: 'Over 100%',
    description: 'This keyboard has over 101 keys.',
  },
  '100': {
    label: '100%',
    description: 'This keyboard has about 100 keys.',
  },
  '90': {
    label: '90%',
    description: 'This keyboard has about 90 keys.',
  },
  '80': {
    label: '80%',
    description: 'This keyboard has about 80 keys.',
  },
  '70': {
    label: '70%',
    description: 'This keyboard has about 70 keys.',
  },
  '60': {
    label: '60%',
    description: 'This keyboard has about 60 keys.',
  },
  '50': {
    label: '50%',
    description: 'This keyboard has about 50 keys.',
  },
  '40': {
    label: '40%',
    description: 'This keyboard has about 40 keys.',
  },
  '30': {
    label: '30%',
    description: 'This keyboard has about 30 keys.',
  },
  macro: {
    label: 'Macro',
    description: 'This keyboard has less than 30 keys.',
  },
  split: {
    label: 'Split',
    description: 'This keyboard is divided for a left hand and a right hand.',
  },
  integrated: {
    label: 'Integrated',
    description: 'This keyboard consists of one case.',
  },
  column_staggered: {
    label: 'Column Staggered',
    description: 'Each key is staggered for column direction.',
  },
  row_staggered: {
    label: 'Row Staggered',
    description: 'Each key is staggered for row direction.',
  },
  ortholinear: {
    label: 'Ortholinear',
    description: 'Each key is evenly arranged.',
  },
  symmetrical: {
    label: 'Symmetrical',
    description: 'Each key is arranged symmetrically.',
  },
  alice: {
    label: 'Alice',
    description: 'Each key is put based on Alice layout.',
  },
  underglow: {
    label: 'Underglow LED',
    description: 'This keyboard has LEDs on the bottom.',
  },
  backlight: {
    label: 'Backlight LED',
    description: 'This keyboard has LEDs to light each key from the back.',
  },
  cherry_mx: {
    label: 'Cherry MX',
    description: 'This keyboard supports Cherry MX compatible key switches.',
  },
  kailh_choc: {
    label: 'Kailh Choc V1',
    description:
      'This keyboard supports Kailh Choc V1 low profile key switches.',
  },
  kailh_choc_v2: {
    label: 'Kailh Choc V2',
    description:
      'This keyboard supports Kailh Choc V2 low profile key switches.',
  },
  kailh_mid_height: {
    label: 'Kailh Mid-height',
    description: 'This keyboard supports Kailh Mid-height key switches.',
  },
  alps: {
    label: 'ALPS',
    description: 'This keyboard supports ALPS key switches.',
  },
  outemulp: {
    label: 'Outemu Low Profile',
    description: 'This keyboard supports Outemu Low Profile key switches.',
  },
  capacitive_sensing_type: {
    label: 'Capacitive Sensing type',
    description: 'This keyboard supports Capacitive Sensing type key switches.',
  },
  hot_swap: {
    label: 'Hotswap',
    description:
      'This keyboard supports a hot swap feature to exchange key switches without soldering.',
  },
  oled: {
    label: 'OLED',
    description: 'This keyboard supports an OLED module.',
  },
  speaker: {
    label: 'Speaker',
    description: 'This keyboard supports a speaker module.',
  },
  wireless: {
    label: 'Wireless',
    description: 'This keyboard supports a wireless connection.',
  },
};

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

type FeatureListProps = {
  definitionId: string;
  features?: IKeyboardFeatures[];
};

function FeatureList(props: FeatureListProps) {
  if (props.features && props.features.length > 0) {
    return (
      <React.Fragment>
        {props.features.map((feature) => (
          <Tooltip
            key={`feature-${props.definitionId}-${feature}`}
            title={featureMap[feature].description}
          >
            <Chip label={featureMap[feature].label} />
          </Tooltip>
        ))}
      </React.Fragment>
    );
  } else {
    return <div>Not specified by the owner of this keyboard.</div>;
  }
}

type ImageListProps = {
  definitionDocument: IKeyboardDefinitionDocument;
};

function ImageList(props: ImageListProps) {
  let imageCount = props.definitionDocument.imageUrl ? 1 : 0;
  imageCount += props.definitionDocument.subImages.length;

  const [activeStep, setActiveStep] = useState<number>(0);

  if (imageCount > 1) {
    useEffect(() => {
      const interval = setInterval(() => {
        setActiveStep((c) => {
          let nextActiveStep = c + 1;
          if (imageCount <= nextActiveStep) {
            nextActiveStep = 0;
          }
          return nextActiveStep;
        });
      }, 10000);
      return () => clearInterval(interval);
    }, []);
  }

  // eslint-disable-next-line no-unused-vars
  const onClickBack = (event: SyntheticEvent) => {
    let backActiveStep = activeStep - 1;
    if (backActiveStep < 0) {
      backActiveStep = imageCount - 1;
    }
    setActiveStep(backActiveStep);
  };

  // eslint-disable-next-line no-unused-vars
  const onClickNext = (event: SyntheticEvent) => {
    let nextActiveStep = activeStep + 1;
    if (imageCount <= nextActiveStep) {
      nextActiveStep = 0;
    }
    setActiveStep(nextActiveStep);
  };

  const imageUrl =
    activeStep === 0
      ? props.definitionDocument.imageUrl
      : props.definitionDocument.subImages[activeStep - 1].image_url;

  return (
    <div className="catalog-introduction-image">
      {props.definitionDocument.imageUrl ? (
        <React.Fragment>
          <div
            className="catalog-introduction-image-container"
            style={{
              backgroundImage: `url('${imageUrl}')`,
            }}
          />
          {imageCount > 1 ? (
            <MobileStepper
              variant="dots"
              position="static"
              backButton={
                <Button size="small" onClick={onClickBack}>
                  <KeyboardArrowLeft />
                </Button>
              }
              nextButton={
                <Button size="small" onClick={onClickNext}>
                  <KeyboardArrowRight />
                </Button>
              }
              steps={imageCount}
              activeStep={activeStep}
              className="catalog-introduction-image-paginate"
            />
          ) : null}
        </React.Fragment>
      ) : (
        <div className="catalog-introduction-image-nothing">No Image</div>
      )}
    </div>
  );
}
