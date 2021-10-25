import { RouteComponentProps, withRouter } from 'react-router-dom';
import React from 'react';
import {
  DocumentsActionsType,
  DocumentsStateType,
} from './Documents.container';
import { CssBaseline } from '@material-ui/core';
import Header from './header/Header.container';
import Footer from '../common/footer/Footer';
import './Documents.scss';
import { sendEventToGoogleAnalytics } from '../../utils/GoogleAnalytics';
import ReviewPolicy from './ReviewPolicy/ReviewPolicy';
import TermsOfUse from './TermsOfUse/TermsOfUse';

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
  }

  render() {
    const docId = this.props.match.params.docId;
    let page;
    if (docId === 'review_policy') {
      page = <ReviewPolicy />;
      sendEventToGoogleAnalytics('docs/review_policy');
    } else if (docId === 'terms_of_use') {
      page = <TermsOfUse />;
      sendEventToGoogleAnalytics('docs/terms_of_use');
    } else {
      page = <div>Not Found.</div>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <Header />
        <main>
          <div className="documents-wrapper">
            <div className="documents-container">{page}</div>
          </div>
          <Footer />
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(Documents);
