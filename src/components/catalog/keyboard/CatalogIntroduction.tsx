import './CatalogIntroduction.scss';
import React from 'react';
import {
  CatalogIntroductionActionsType,
  CatalogIntroductionStateType,
} from './CatalogIntroduction.container';
import {
  Chip,
  Grid,
  Link,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { IKeyboardFeatures } from '../../../store/state';
import { CatalogKeyboardHeader } from './CatalogKeyboardHeader';

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

type CatalogIntroductionState = {};
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
  }

  render() {
    let descriptionNodeList: React.ReactNode[] | string;
    if (this.props.definitionDocument!.description) {
      descriptionNodeList = this.props
        .definitionDocument!.description.split(/(\n)/)
        .map((item: string, index: number) => {
          return (
            <React.Fragment key={index}>
              {item.match(/\n/) ? <br /> : item}
            </React.Fragment>
          );
        });
    } else {
      descriptionNodeList =
        'A description is not specified by the owner of this keyboard.';
    }
    return (
      <div className="catalog-introduction-wrapper">
        <div className="catalog-introduction-container">
          <CatalogKeyboardHeader
            definitionDocument={this.props.definitionDocument!}
          />
          <Paper elevation={0} className="catalog-introduction-content">
            <Grid container>
              <Grid item sm={6} className="catalog-introduction-column">
                <div className="catalog-introduction-image">
                  {this.props.definitionDocument!.imageUrl ? (
                    <div
                      className="catalog-introduction-image-container"
                      style={{
                        backgroundImage: `url(${
                          this.props.definitionDocument!.imageUrl
                        })`,
                      }}
                    />
                  ) : (
                    <div className="catalog-introduction-image-nothing">
                      No Image
                    </div>
                  )}
                </div>
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
              </Grid>
              <Grid item sm={6} className="catalog-introduction-column">
                <section className="catalog-introduction-section">
                  <Typography variant="body1">{descriptionNodeList}</Typography>
                </section>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </div>
    );
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
