import './OrganizationList.scss';
import React from 'react';
import {
  OrganizationListActionsType,
  OrganizationListStateType,
} from './OrganizationList.container';
import { Button, Card, CardContent, Link } from '@material-ui/core';
import moment from 'moment-timezone';
import { IOrganization } from '../../../services/storage/Storage';

type OrganizationListState = {};
type OwnProps = {};
type OrganizationListProps = OwnProps &
  Partial<OrganizationListActionsType> &
  Partial<OrganizationListStateType>;

export default class OrganizationList extends React.Component<
  OrganizationListProps,
  OrganizationListState
> {
  constructor(props: OrganizationListProps | Readonly<OrganizationListProps>) {
    super(props);
  }

  render() {
    return (
      <div className="organization-list-wrapper">
        <div className="organization-list-container">
          <div className="organization-list">
            {this.props.organizations!.map((organization, index) => (
              <div key={index} className="organization">
                <OrganizationRow organization={organization} />
              </div>
            ))}
            <div className="organization">
              <div className="no-registered-organization">
                {`
                  If you want to create a new organization in Remap, please send a request from
                  `}
                <Link
                  href="https://docs.google.com/forms/d/e/1FAIpQLSc4ntqwYdpE16b9KMwINptJbBYJPVqygvol_57MVXlxLnteUQ/viewform?usp=sf_link"
                  target="_blank"
                  rel="noreferrer"
                >
                  this form
                </Link>
                {'.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type OrganizationProps = {
  organization: IOrganization;
};

class OrganizationRow extends React.Component<OrganizationProps, any> {
  render() {
    return (
      <Card>
        <CardContent>
          <div className="organization-container">
            <div className="organization-container-left">
              <div className="organization-header">
                <h2 className="organization-name">
                  {this.props.organization.name}
                </h2>
              </div>
              <div className="organization-meta">
                <div className="organization-meta-info">
                  <span className="organization-meta-info-label">
                    Description:
                  </span>
                  {this.props.organization.description}
                </div>
              </div>
              <div className="organization-meta">
                <div className="organization-meta-info">
                  <span className="organization-meta-info-label">
                    Created at:
                  </span>
                  {moment(this.props.organization.created_at).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </div>
                <div className="organization-meta-info">
                  <span className="organization-meta-info-label">
                    Updated at:{' '}
                  </span>
                  {moment(this.props.organization.updated_at).format(
                    'YYYY-MM-DD HH:mm:ss'
                  )}
                </div>
              </div>
            </div>
            <div className="organization-container-right">
              <Button
                color="primary"
                onClick={() => {
                  location.href = `/organizations/${this.props.organization.id}`;
                }}
              >
                Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
