import React from 'react';
import { Typography } from '@material-ui/core';

export default function ReviewPolicy() {
  return (
    <React.Fragment>
      <Typography variant="h3">Remap Review Policy</Typography>
      <section>
        <Typography variant="body1" gutterBottom={true}>
          1. The applicant needs to agree with the following at submitting the
          review request: a) The applicant himself/herself has the right for the
          target keyboard and the keyboard definition file (if the author type
          is individual). b) The applicant belongs to the organization and the
          organization has the right for the target keyboard and the keyboard
          definition file (if the author type is organization). c) The display
          name, the link to the account page of the applicant&apos;s GitHub
          account or the organization&apos;s name and the website link are
          published to users on Remap as the author of the keyboard definition.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          2. The applicant must have a right for the target keyboard definition
          file the applicant registers to the Remap. The applicant has to
          provide information which is necessary for the review by the Remap
          team. In the review process, reviewers confirm whether the applicant
          actually is a person who has a right for the keyboard definition file
          based on submitted information. If reviewers determine that the
          submitted information is valid, the review request is approved and the
          keyboard definition file becomes available.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          3. If the set of the vendor ID, the product ID and the product name
          for your review request has already been registered into the Remap
          database, your review request will be rejected automatically.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          4. The display name and the link to the account page of your GitHub
          account or the name and the website link of the organization are
          published on the Remap as the applicant of the keyboard definition. A
          user can report the issue for the Remap team when the user finds that
          the name and the link displayed on the Remap is not the correct author
          of the keyboard definition. Remap team investigates the report and can
          reject and/or delete the keyboard definition if there is some problem
          about the keyboard definition and the applicant.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          5. The Remap team investigates the issue reported by users with the
          following points: a) The Remap team confirms whether the applicant has
          the right of the keyboard definition or not by contacting the
          applicant using the GitHub account or the contact information of the
          organization. b) The Remap team identifies the people who have the
          right of the keyboard and keyboard definition. c) The Remap team does
          other investigations according to necessary.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          6. If the review request submitted by the correct applicant is
          rejected by the reason that the same keyboard definition has already
          been registered by the incorrect applicant, the applicant can request
          the investigation to the Remap team.
        </Typography>
        <Typography variant="body1" gutterBottom={true}>
          7. The Remap team can update the statements of this review policy
          without any announcements.
        </Typography>
      </section>
      <section>
        <Typography variant="body1" align="right">
          Last updated: January 5th, 2022
          <br />
          Created: January 15th, 2021
        </Typography>
      </section>
    </React.Fragment>
  );
}
