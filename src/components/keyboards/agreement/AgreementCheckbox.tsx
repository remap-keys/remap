import React from 'react';
import { Checkbox, FormControlLabel, Link } from '@mui/material';
import { t } from 'i18next';

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
          {t('I agree the policy:')}{' '}
          <Link href="/docs/review_policy" target="_blank" rel="noreferrer">
            Remap Review Policy
          </Link>
        </span>
      }
    />
  );
}
