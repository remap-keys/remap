import React from 'react';
import {
  BuildFormActionsType,
  BuildFormStateType,
} from './BuildForm.container';

type OwnProps = {};
type BuildFormProps = OwnProps &
  Partial<BuildFormActionsType> &
  Partial<BuildFormStateType>;

export default function BuildForm(props: BuildFormProps) {
  return (
    <div>
      <h1>Build Form</h1>
    </div>
  );
}
