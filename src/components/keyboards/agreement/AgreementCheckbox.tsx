import React from 'react';
import { Checkbox, FormControlLabel, Link } from '@material-ui/core';

export type IProps = {
  agreement: boolean;
  // eslint-disable-next-line no-unused-vars
  updateAgreement: (agreed: boolean) => void;
};

export function AgreementCheckbox(props: IProps) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={props.agreement}
          onChange={(event) => {
            props.updateAgreement(event.target.checked);
          }}
          id="create-definition-agreement"
          color="primary"
        />
      }
      label={
        <span>
          I agree the Keyboard Definition{' '}
          <Link href="/docs/review_policy" target="_blank" rel="noreferrer">
            Review Policy
          </Link>
          .
        </span>
      }
    />
  );
}
