import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import {
  DocumentsActionsType,
  DocumentsStateType,
} from './Documents.container';
import { CssBaseline } from '@material-ui/core';
import Header from './header/Header.container';
import Content from './content/Content.container';
import { IDocumentPage } from '../../store/state';
import Footer from '../common/footer/Footer';
import './Documents.scss';

type DocumentsState = {};

type RouteParams = {
  docId: string;
};

type OwnProps = {};
type DocumentsPropsType = OwnProps &
  Partial<DocumentsActionsType> &
  Partial<DocumentsStateType> &
  RouteComponentProps<RouteParams>;

class Documents extends React.Component<DocumentsPropsType, DocumentsState> {
  constructor(props: DocumentsPropsType | Readonly<DocumentsPropsType>) {
    super(props);
  }

  componentDidMount() {
    if (this.props.auth) {
      this.props.auth.subscribeAuthStatus((user) => {
        this.props.updateSignedIn!(!!user);
      });
    }

    const page = this.props.match.params.docId as IDocumentPage;
    if (page === 'review_policy') {
      this.props.updateDocumentPage!('review_policy');
    } else if (page === 'terms_of_use') {
      this.props.updateDocumentPage!('terms_of_use');
    } else {
      this.props.updateDocumentPage!(null);
    }
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <div className="documents-wrapper">
            <div className="documents-container">
              <Content />
            </div>
          </div>
          <Footer />
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(Documents);
