import React from 'react';
import { ContentActionsType, ContentStateType } from './Content.container';
import './Content.scss';
import { CircularProgress, Tab, Tabs } from '@mui/material';
import Footer from '../../common/footer/Footer.container';
import { ICatalogPhase } from '../../../store/state';
import CatalogSearch from '../search/CatalogSearch.container';
import CatalogKeyboard from '../keyboard/CatalogKeyboard.container';
import { CatalogKeyboardHeader } from '../keyboard/CatalogKeyboardHeader';
import {
  IKeyboardDefinitionDocument,
  IOrganization,
} from '../../../services/storage/Storage';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import TweetButton from '../../common/twitter/TweetButton';
import { useNavigate } from 'react-router-dom';

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
    const phase = this.props.phase!;
    switch (phase) {
      case 'init':
      case 'processing':
        return <PhaseProcessing />;
      case 'list':
        return (
          <>
            <CatalogSearch />
            <Footer />
          </>
        );
      case 'introduction':
      case 'keymap':
      case 'firmware':
      case 'build':
        return (
          <CategoryKeyboardContent
            phase={phase}
            definitionDocument={this.props.definitionDocument!}
            goToIntroduction={this.props.goToIntroduction!.bind(this)}
            goToKeymap={this.props.goToKeymap!.bind(this)}
            goToFirmware={this.props.goToFirmware!.bind(this)}
            goToBuild={this.props.goToBuild!.bind(this)}
            organization={this.props.organization!}
          />
        );
      default:
        throw new Error(`Unknown state.catalog.app.phase value: ${phase}`);
    }
  }
}

function PhaseProcessing() {
  return (
    <div className="catalog-processing-wrapper">
      <div>
        <CircularProgress size={24} />
      </div>
      <div>Processing...</div>
    </div>
  );
}

type CategoryKeyboardContentProps = {
  phase: ICatalogPhase;
  definitionDocument: IKeyboardDefinitionDocument;
  goToIntroduction: () => void;
  goToKeymap: () => void;
  goToFirmware: () => void;
  goToBuild: () => void;
  organization: IOrganization | null;
};

const CategoryKeyboardContent: React.FC<CategoryKeyboardContentProps> = ({
  phase,
  definitionDocument,
  goToIntroduction,
  goToKeymap,
  goToFirmware,
  goToBuild,
  organization,
}) => {
  const navigate = useNavigate();
  const onChangeTab = (event: React.ChangeEvent<{}>, value: number) => {
    if (value === 0) {
      sendEventToGoogleAnalytics('catalog/introduction', {
        vendor_id: definitionDocument.vendorId,
        product_id: definitionDocument.productId,
        product_name: definitionDocument.productName,
      });
      navigate(`/catalog/${definitionDocument.id}`);
      goToIntroduction();
    } else if (value === 1) {
      sendEventToGoogleAnalytics('catalog/keymap', {
        vendor_id: definitionDocument.vendorId,
        product_id: definitionDocument.productId,
        product_name: definitionDocument.productName,
      });
      navigate(`/catalog/${definitionDocument.id}/keymap`);
      goToKeymap();
    } else if (value === 2) {
      sendEventToGoogleAnalytics('catalog/firmware', {
        vendor_id: definitionDocument.vendorId,
        product_id: definitionDocument.productId,
        product_name: definitionDocument.productName,
      });
      navigate(`/catalog/${definitionDocument.id}/firmware`);
      goToFirmware();
    } else if (value === 3) {
      sendEventToGoogleAnalytics('catalog/build', {
        vendor_id: definitionDocument.vendorId,
        product_id: definitionDocument.productId,
        product_name: definitionDocument.productName,
      });
      navigate(`/catalog/${definitionDocument.id}/build`);
      goToBuild();
    }
  };
  if (
    (
      ['introduction', 'keymap', 'firmware', 'build'] as ICatalogPhase[]
    ).includes(phase)
  ) {
    const value =
      phase === 'keymap'
        ? 1
        : phase === 'firmware'
          ? 2
          : phase === 'build'
            ? 3
            : 0;
    // eslint-disable-next-line no-undef
    const url = `https://remap-keys.app/catalog/${definitionDocument!.id}`;
    return (
      <>
        <div className="catalog-content">
          <CatalogKeyboardHeader
            definitionDocument={definitionDocument!}
            organization={organization}
          />
          <div className="catalog-content-nav">
            <Tabs value={value} indicatorColor="primary" onChange={onChangeTab}>
              <Tab label="Overview" />
              <Tab label="Keymap" />
              <Tab label="Firmware" />
              <Tab label="Build" />
            </Tabs>
            <div className="catalog-share-buttons">
              <TweetButton url={url} />
            </div>
          </div>
          <CatalogKeyboard />
        </div>
        <Footer />
      </>
    );
  } else {
    return null;
  }
};
