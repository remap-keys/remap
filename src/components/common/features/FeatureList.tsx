import { IKeyboardFeatures } from '../../../store/state';
import React from 'react';
import { Chip, Tooltip } from '@mui/material';

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
  gateron_low_profile: {
    label: 'Gateron Low Profile',
    description: 'This keyboard supports Gateron Low Profile key switches.',
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

type FeatureListProps = {
  features?: IKeyboardFeatures[];
  noFeatureMessage?: string;
  size: 'small' | 'medium';
};

export default function FeatureList(props: FeatureListProps) {
  if (props.features && props.features.length > 0) {
    return (
      <React.Fragment>
        {props.features.map((feature, index) => (
          <Tooltip
            key={`feature-${feature}-${index}`}
            title={featureMap[feature].description}
          >
            <Chip label={featureMap[feature].label} size={props.size} />
          </Tooltip>
        ))}
      </React.Fragment>
    );
  } else if (props.noFeatureMessage != undefined) {
    return <div> {props.noFeatureMessage} </div>;
  } else {
    return <div>Not specified by the owner of this keyboard.</div>;
  }
}
