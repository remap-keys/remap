import './CatalogKeyboard.scss';
import React from 'react';
import {
  CatalogKeyboardActionsType,
  CatalogKeyboardStateType,
} from './CatalogKeyboard.container';
import {
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { getGitHubUserName } from '../../../services/storage/Storage';
import { IKeyboardFeatures } from '../../../store/state';

type CatalogKeyboardState = {};
type OwnProps = {};
type CatalogKeyboardProps = OwnProps &
  Partial<CatalogKeyboardActionsType> &
  Partial<CatalogKeyboardStateType>;

const featureMap: { [p: string]: { [p: string]: string } } = {
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
    label: 'Kailh Choc',
    description: 'This keyboard supports Kailh Choc low profile key switches.',
  },
  hot_swap: {
    label: 'Hotswap',
    description:
      'This keyboard supports a hot swap feature to exchange key switches without soldering.',
  },
  at90usb1286: {
    label: 'AT90USB1286',
    description: 'This keyboard uses a "AT90USB1286" micro control unit',
  },
  at90usb1287: {
    label: 'AT90USB1287',
    description: 'This keyboard uses a "AT90USB1287" micro control unit',
  },
  at90usb646: {
    label: 'AT90USB646',
    description: 'This keyboard uses a "AT90USB646" micro control unit',
  },
  at90usb647: {
    label: 'AT90USB647',
    description: 'This keyboard uses a "AT90USB647" micro control unit',
  },
  atmega16u2: {
    label: 'ATmega16U2',
    description: 'This keyboard uses a "ATmega16U2" micro control unit',
  },
  atmega16u4: {
    label: 'ATmega16U4',
    description: 'This keyboard uses a "ATmega16U4" micro control unit',
  },
  atmega328p: {
    label: 'ATmega328P',
    description: 'This keyboard uses a "ATmega328P" micro control unit',
  },
  atmega32a: {
    label: 'ATmega32A',
    description: 'This keyboard uses a "ATmega32A" micro control unit',
  },
  atmega32u2: {
    label: 'ATmega32U2',
    description: 'This keyboard uses a "ATmega32U2" micro control unit',
  },
  atmega32u4: {
    label: 'ATmega32U4',
    description: 'This keyboard uses a "ATmega32U4" micro control unit',
  },
  oled: {
    label: 'OLED',
    description: 'This keyboard supports an OLED module.',
  },
  speaker: {
    label: 'Speaker',
    description: 'This keyboard supports a speaker module.',
  },
};

export default class CatalogKeyboard extends React.Component<
  CatalogKeyboardProps,
  CatalogKeyboardState
> {
  constructor(props: CatalogKeyboardProps | Readonly<CatalogKeyboardProps>) {
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
      <div className="catalog-keyboard-wrapper">
        <div className="catalog-keyboard-container">
          <Tabs
            variant="fullWidth"
            centered
            value={0}
            indicatorColor="primary"
            className="catalog-keyboard-tabs"
          >
            <Tab label="Introduction" />
            <Tab label="Keymap" />
          </Tabs>
          <Paper elevation={0} className="catalog-keyboard-content">
            <Grid container>
              <Grid item sm={6} className="catalog-keyboard-column">
                <div className="catalog-keyboard-image">
                  {this.props.definitionDocument!.imageUrl ? (
                    <img src={this.props.definitionDocument!.imageUrl} />
                  ) : (
                    <div className="catalog-keyboard-image-nothing">
                      No Image
                    </div>
                  )}
                </div>
              </Grid>
              <Grid item sm={6} className="catalog-keyboard-column">
                <header className="catalog-keyboard-header">
                  <Typography variant="h1">
                    {this.props.definitionDocument!.name}
                  </Typography>
                  <Typography variant="subtitle1">
                    designed by{' '}
                    {getGitHubUserName(this.props.definitionDocument!)}
                  </Typography>
                </header>
                <section className="catalog-keyboard-section">
                  <Typography variant="body1">{descriptionNodeList}</Typography>
                </section>
                <section className="catalog-keyboard-section">
                  <Typography variant="h2">Features</Typography>
                  <div className="catalog-keyboard-chip-container">
                    <FeatureList
                      definitionId={this.props.definitionDocument!.id}
                      features={this.props.definitionDocument!.features}
                    />
                  </div>
                </section>
                <section className="catalog-keyboard-section">
                  <Typography variant="h2">Stores</Typography>
                  {this.props.definitionDocument!.stores.length > 0 ? (
                    <div className="catalog-keyboard-stores">
                      {this.props.definitionDocument!.stores.map(
                        (store, index) => {
                          return (
                            <Typography key={index} variant="body1">
                              <a
                                href={store.url}
                                target="_blank"
                                rel="noreferrer"
                                className="catalog-keyboard-store"
                              >
                                {store.name}
                              </a>
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
