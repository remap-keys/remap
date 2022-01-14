import React from 'react';
import { ContentActionsType } from './Content.container';
import { ContentStateType } from './Content.container';
import './Content.scss';
import { CircularProgress } from '@mui/material';
import Footer from '../../common/footer/Footer.container';
import { IOrganizationsPhase } from '../../../store/state';
import OrganizationList from '../organizationlist/OrganizationList.container';
import EditOrganization from '../editorganization/EditOrganization.container';

type ContentState = {};
type OwnProps = {};
type ContentProps = OwnProps &
  Partial<ContentActionsType> &
  Partial<ContentStateType>;

export default class Content extends React.Component<
  ContentProps,
  ContentState
> {
  constructor(props: ContentProps | Readonly<ContentProps>) {
    super(props);
  }

  render() {
    return (
      <div className="organizations-content">
        <Contents phase={this.props.phase!} />
        <Footer />
      </div>
    );
  }
}

type ContentsProps = {
  phase: IOrganizationsPhase;
};
function Contents(props: ContentsProps) {
  switch (props.phase) {
    case 'signing':
    case 'init':
    case 'processing':
    case 'signout':
      return <PhaseProcessing />;
    case 'list':
      return <OrganizationList />;
    case 'edit':
      return <EditOrganization />;
    default:
      throw new Error(
        `Unknown state.organizations.app.phase value: ${props.phase}`
      );
  }
}

function PhaseProcessing() {
  return (
    <div className="organizations-phase-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>Processing...</div>
    </div>
  );
}
