import React from 'react';
import {
  RemainingBuildPurchaseHistoryDialogActionsType,
  RemainingBuildPurchaseHistoryDialogStateType,
} from './RemainingBuildPurchaseHistoryDialog.container';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import { format } from 'date-fns';

type OwnProps = {};
type RemainingBuildPurchaseHistoryDialogProps = OwnProps &
  Partial<RemainingBuildPurchaseHistoryDialogActionsType> &
  Partial<RemainingBuildPurchaseHistoryDialogStateType>;

export default function RemainingBuildPurchaseHistoryDialog(
  props:
    | RemainingBuildPurchaseHistoryDialogProps
    | Readonly<RemainingBuildPurchaseHistoryDialogProps>
) {
  return (
    <Dialog open={props.histories !== undefined} fullWidth maxWidth="md">
      <DialogTitle>{t('Purchase History')}</DialogTitle>
      <DialogContent>
        {props.histories !== undefined && props.histories.length > 0 ? (
          <>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>{t('Date')}</TableCell>
                    <TableCell>{t('Amount')}</TableCell>
                    <TableCell>{t('Status')}</TableCell>
                    <TableCell>{t('Error')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.histories.map((history, index) => {
                    let amount = '';
                    if (history.captureOrderResponseJson !== undefined) {
                      const captureOrderResponse = JSON.parse(
                        history.captureOrderResponseJson
                      );
                      amount = `$${
                        captureOrderResponse.purchase_units[0].payments
                          .captures[0].amount.value
                      }`;
                    }
                    return (
                      <TableRow key={index}>
                        <TableCell>{history.id}</TableCell>
                        <TableCell>
                          {format(history.updatedAt, 'yyyy/MM/dd HH:mm:ss')}
                        </TableCell>
                        <TableCell>{amount}</TableCell>
                        <TableCell>{history.status}</TableCell>
                        <TableCell>{history.errorMessage}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="caption" style={{ marginTop: '16px' }}>
              *{' '}
              {t(
                'If you have any questions about your purchase, please contact the Remap team.'
              )}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">{t('No purchase history.')}</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.clearPurchaseHistories!();
          }}
        >
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
