import React from 'react';
import { Checkbox, FormControlLabel, Theme, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

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
        <HtmlTooltip
          title={
            <ol>
              <li>
                The applicant needs to agree with the following at submitting
                the review request: a) The applicant himself/herself has the
                right for the target keyboard and the keyboard definition file.
                b) The display name and the link to the account page of the
                applicant&apos;s GitHub account are published to users on Remap
                as the author of the keyboard definition.
              </li>
              <li>
                If the set of the vendor ID, the product ID and the product name
                for your review request does not exist in the Remap database,
                your review request will be approved immediately.
              </li>
              <li>
                If the set of the vendor ID, the product ID and the product name
                for your review request has already been registered into the
                Remap database, your review request will be rejected
                automatically.
              </li>
              <li>
                The display name and the link to the account page of your GitHub
                account are published on the Remap as the applicant of the
                keyboard definition. A user can report the issue for the Remap
                team when the user finds that the GitHub user displayed on the
                Remap is not the correct author of the keyboard definition.
                Remap team investigates the report and can reject and/or delete
                the keyboard definition if there is some problem about the
                keyboard definition and the applicant.
              </li>
              <li>
                The Remap team investigates the issue reported by users with the
                following points: a) The Remap team confirms whether the
                applicant has the right of the keyboard definition or not by
                contacting the applicant using the GitHub account. b) The Remap
                team identifies the people who have the right of the keyboard
                and keyboard definition. c) The Remap team does other
                investigations according to necessary.
              </li>
              <li>
                If the review request submitted by the correct applicant is
                rejected by the reason that the same keyboard definition has
                already been registered by the incorrect applicant, the
                applicant can request the investigation to the Remap team.
              </li>
            </ol>
          }
        >
          <span>I agree the Keyboard Definition Review Policy.</span>
        </HtmlTooltip>
      }
    />
  );
}
