import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  CatalogKeywordSearchDialogActionsType,
  CatalogKeywordSearchDialogStateType,
} from './CatalogKeywordSearchDialog.container';
import {
  getGitHubUserDisplayName,
  getGitHubUserName,
  IKeyboardDefinitionDocument,
  IOrganization,
} from '../../../services/storage/Storage';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { t } from 'i18next';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (keyboard: IKeyboardDefinitionDocument) => void;
};

type CatalogKeywordSearchDialogProps = OwnProps &
  Partial<CatalogKeywordSearchDialogStateType> &
  Partial<CatalogKeywordSearchDialogActionsType>;

export default function CatalogKeywordSearchDialog(
  props:
    | CatalogKeywordSearchDialogProps
    | Readonly<CatalogKeywordSearchDialogProps>
) {
  const [
    filteredKeyboardDefinitionDocuments,
    setFilteredKeyboardDefinitionDocuments,
  ] = useState<IKeyboardDefinitionDocument[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  const keywordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.open) {
      setKeyword('');
      props.search!();
      setTimeout(() => {
        keywordInputRef.current?.focus();
      }, 0);
    }
  }, [props.open]);

  useEffect(() => {
    if (keyword.trim().length < 2) {
      setFilteredKeyboardDefinitionDocuments([]);
    } else {
      setFilteredKeyboardDefinitionDocuments(
        (props.approvedKeyboardDefinitionDocuments || []).filter((keyboard) =>
          keyboard.name.toLowerCase().includes(keyword.trim().toLowerCase())
        )
      );
    }
  }, [keyword]);

  return (
    <Dialog open={props.open} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Find a Keyboard')}</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('Type at least 2 characters to search for a keyboard.')}
        </Typography>
        <FormControl
          sx={{ width: '100%', display: 'flex', flexDirection: 'row', mb: 1 }}
        >
          <TextField
            size="small"
            label={t('Keyboard Name')}
            inputRef={keywordInputRef}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            sx={{ flexGrow: 1 }}
          />
        </FormControl>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            height: '300px',
            overflowY: 'auto',
          }}
        >
          {filteredKeyboardDefinitionDocuments.map((keyboard) => (
            <KeyboardCard
              key={keyboard.id}
              definition={keyboard}
              organizationMap={props.organizationMap!}
              onClick={() => {
                props.onSubmit(keyboard);
              }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  );
}

type KeyboardCardProps = {
  definition: IKeyboardDefinitionDocument;
  organizationMap: Record<string, IOrganization>;
  onClick: () => void;
};

function KeyboardCard(props: KeyboardCardProps) {
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
    <Paper
      variant="outlined"
      onClick={() => {
        props.onClick();
      }}
      sx={{ cursor: 'pointer' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {props.definition.imageUrl ? (
          <Box
            component="img"
            src={props.definition.imageUrl}
            alt={props.definition.name}
            sx={{ width: '100px', height: '75px' }}
          />
        ) : (
          <Box
            sx={{
              width: '100px',
              height: '75px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PhotoLibraryIcon />
            {t('No Image')}
          </Box>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            ml: 2,
            alignItems: 'center',
          }}
        >
          <Box>
            <Avatar
              alt={designerName}
              src={designerIconImageUrl}
              sx={{ width: '32px', height: '32px', mr: 1 }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: '700' }}>
              {props.definition.name}
            </Typography>
            <Typography variant="caption">
              {t('Designed by')} {designerName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
