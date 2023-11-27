import React, { useState } from 'react';
import {
  CatalogSearchActionsType,
  CatalogSearchStateType,
} from './CatalogSearch.container';
import './CatalogSearch.scss';
import {
  Avatar,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  IconButton,
  Pagination,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  getGitHubUserDisplayName,
  getGitHubUserName,
  IKeyboardDefinitionDocument,
  IOrganization,
} from '../../../services/storage/Storage';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import FeatureList from '../../common/features/FeatureList';
import CatalogSearchForm from './CatalogSearchForm.container';
import CatalogSearchDialog from './CatalogSearchDialog';
import { IKeyboardFeatures } from '../../../store/state';
import { isSmallDisplay } from '../../../utils/DisplayUtils';

type CatalogSearchState = {
  showSearchDialog: boolean;
  isSmallDisplay: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
};
type OwnProps = {};
type CatalogSearchProps = OwnProps &
  Partial<CatalogSearchActionsType> &
  Partial<CatalogSearchStateType>;

class CatalogSearch extends React.Component<
  CatalogSearchProps,
  CatalogSearchState
> {
  constructor(props: CatalogSearchProps | Readonly<CatalogSearchProps>) {
    super(props);
    this.state = {
      showSearchDialog: false,
      isSmallDisplay: isSmallDisplay(),
      containerRef: React.createRef<HTMLDivElement>(),
    };
  }
  private closeSearchDialog(
    originalKeyword: string,
    originalFeatures: IKeyboardFeatures[]
  ) {
    this.props.updateKeyword!(originalKeyword);
    this.props.resetFeatures!(originalFeatures);
    this.setState({ showSearchDialog: false });
  }

  private onClickSearch() {
    this.setState({ showSearchDialog: true });
  }

  private submitSearchDialog() {
    this.setState({ showSearchDialog: false });
  }

  componentDidMount() {
    // eslint-disable-next-line no-undef
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentWillUnmount() {
    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    let isSmall = isSmallDisplay();
    if (this.state.isSmallDisplay != isSmall) {
      this.setState({ isSmallDisplay: isSmall });
    }
  }

  render() {
    return (
      <>
        <div className="catalog-search-wrapper">
          <div
            className="catalog-search-container"
            ref={this.state.containerRef}
          >
            <Grid container sx={{ maxWidth: '960px' }}>
              <Grid item sm={3} xs={12}>
                {this.state.isSmallDisplay ? (
                  <Grid container>
                    <Grid item xs={10} className="catalog-search-condition-xm">
                      {this.props.keyword && (
                        <span className="catalog-search-condition-xm-keyword">
                          {this.props.keyword}
                        </span>
                      )}
                      <FeatureList
                        features={this.props.features!}
                        noFeatureMessage=""
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        aria-label="search"
                        onClick={this.onClickSearch.bind(this)}
                      >
                        <SearchRoundedIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ) : (
                  <CatalogSearchForm
                    keyword={this.props.keyword!}
                    features={this.props.features!}
                    buildSupport={this.props.buildSupport!}
                  />
                )}
              </Grid>
              <Grid item sm={9} xs={12}>
                <SearchResult
                  definitionDocuments={this.props.searchResult!}
                  containerRef={this.state.containerRef}
                  organizationMap={this.props.organizationMap!}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <CatalogSearchDialog
          open={this.state.showSearchDialog}
          keyword={this.props.keyword!}
          features={this.props.features!}
          buildSupport={this.props.buildSupport!}
          onClose={this.closeSearchDialog.bind(this)}
          onSubmit={this.submitSearchDialog.bind(this)}
        />
      </>
    );
  }
}

export default CatalogSearch;

const SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE = 4;

type SearchResultProps = {
  definitionDocuments: IKeyboardDefinitionDocument[];
  containerRef?: React.RefObject<HTMLDivElement>;
  organizationMap: Record<string, IOrganization>;
};

function SearchResult(props: SearchResultProps) {
  const [offset, setOffset] = useState(0);

  const onChangePage = (event: any, page: number): void => {
    setOffset((page - 1) * SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE);
    if (props.containerRef && props.containerRef.current) {
      props.containerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="catalog-search-result-container">
      {props.definitionDocuments
        .slice(offset, offset + SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE)
        .map((result) => (
          <KeyboardCard
            definition={result}
            organizationMap={props.organizationMap}
            key={`search-result-${result.id}`}
          />
        ))}
      <div className="catalog-search-result-pagination">
        <Pagination
          count={Math.ceil(
            props.definitionDocuments.length /
              SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE
          )}
          page={Math.floor(offset / SEARCH_RESULT_KEYBOARD_COUNT_PER_PAGE) + 1}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}

type KeyboardCardProps = {
  definition: IKeyboardDefinitionDocument;
  organizationMap: Record<string, IOrganization>;
};

function KeyboardCard(props: KeyboardCardProps) {
  const onClickCard = () => {
    sendEventToGoogleAnalytics('catalog/open_from_search');
    return true;
  };

  const isIndividual = props.definition.authorType === 'individual';
  const organization: IOrganization =
    props.organizationMap[props.definition.organizationId!];
  const designerName =
    !props.definition.authorType || isIndividual
      ? getGitHubUserDisplayName(props.definition)
      : organization.name;
  const designerIconImageUrl =
    !props.definition.authorType || isIndividual
      ? `https://avatars.githubusercontent.com/${getGitHubUserName(
          props.definition
        )}`
      : organization.icon_image_url;

  return (
    <Card className="catalog-search-result-card">
      <a
        href={`/catalog/${props.definition.id}`}
        onClick={onClickCard}
        rel="noreferrer"
      >
        {props.definition.imageUrl ? (
          <CardMedia
            image={props.definition.imageUrl}
            className="catalog-search-result-card-image"
          />
        ) : (
          <div className="catalog-search-result-card-no-image">
            <PhotoLibraryIcon />
            No Image
          </div>
        )}
      </a>

      <CardContent className="catalog-search-result-card-container">
        <a
          href={`/catalog/${props.definition.id}`}
          onClick={onClickCard}
          rel="noreferrer"
        >
          <div className="catalog-search-result-card-wrapper">
            <div className="catalog-search-result-card-content">
              <div className="catalog-search-result-card-header">
                <div className="catalog-search-result-card-icon">
                  <Avatar alt={designerName} src={designerIconImageUrl} />
                </div>
                <div className="catalog-search-result-card-header-name-container">
                  <h2 className="catalog-search-result-card-name">
                    {props.definition.name}
                  </h2>
                  <div className="catalog-search-result-card-header-name-row">
                    <Typography variant="caption">
                      Designed by {designerName}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="catalog-search-result-card-features">
                <FeatureList
                  features={props.definition.features}
                  size="small"
                />
              </div>
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
