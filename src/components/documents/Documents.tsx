import React, { useEffect } from 'react';
import {
  DocumentsActionsType,
  DocumentsStateType,
} from './Documents.container';
import { CssBaseline } from '@mui/material';
import Header from './header/Header.container';
import Footer from '../common/footer/Footer';
import './Documents.scss';
import { sendEventToGoogleAnalytics } from '../../utils/GoogleAnalytics';
import ReviewPolicy from './reviewpolicy/ReviewPolicy';
import TermsOfUse from './termsofuse/TermsOfUse';
import Faq from './faq/Faq';
import Index from './index/Index';
import { useParams } from 'react-router-dom';
import SupportQmk022 from './support-qmk-022/SupportQmk022';

type RouteParams = {
  docId: string;
};

type OwnProps = {};
type DocumentsPropsType = OwnProps &
  Partial<DocumentsActionsType> &
  Partial<DocumentsStateType>;

export default function Documents(props: DocumentsPropsType) {
  useEffect(() => {
    props.initializeMeta!();
    if (props.auth) {
      props.auth.subscribeAuthStatus((user) => {
        props.updateSignedIn!(!!user);
      });
    }
  });

  const params = useParams<RouteParams>();

  const docId = params.docId;
  let page;
  if (docId === 'review_policy') {
    page = <ReviewPolicy />;
    sendEventToGoogleAnalytics('docs/review_policy');
  } else if (docId === 'terms_of_use') {
    page = <TermsOfUse />;
    sendEventToGoogleAnalytics('docs/terms_of_use');
  } else if (docId === 'faq') {
    page = <Faq />;
    sendEventToGoogleAnalytics('docs/faq');
  } else if (docId === 'support-qmk-022') {
    page = <SupportQmk022 />;
    sendEventToGoogleAnalytics('docs/support-qmk-022');
  } else {
    page = <Index />;
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
