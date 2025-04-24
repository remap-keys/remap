import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { PayPalButtons } from '@paypal/react-paypal-js';
import {
  RemainingBuildPurchaseDialogActionsType,
  RemainingBuildPurchaseDialogStateType,
} from './RemainingBuildPurchaseDialog.container';
import { isError } from '../../../types';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  onPurchase: () => void;
};
type RemainingBuildPurchaseDialogProps = OwnProps &
  Partial<RemainingBuildPurchaseDialogStateType> &
  Partial<RemainingBuildPurchaseDialogActionsType>;

export function RemainingBuildPurchaseDialog(
  props: RemainingBuildPurchaseDialogProps
) {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const createOrder = async () => {
    const orderCreateResult = await props.storage!.orderCreate(language);
    if (isError(orderCreateResult)) {
      console.error('Error creating order:', orderCreateResult);
      props.showErrorMessage!(
        'Error creating order: ' + orderCreateResult.error
      );
      throw new Error('Error creating order');
    }
    return orderCreateResult.value;
  };

  const captureOrder = async (orderId: string) => {
    const captureOrderResult = await props.storage!.captureOrder(orderId);
    if (isError(captureOrderResult)) {
      console.error('Error capturing order:', captureOrderResult);
      props.showErrorMessage!(
        'Error capturing order: ' + captureOrderResult.error
      );
      throw new Error('Error capturing order');
    }
    props.onPurchase();
  };

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth>
      <DialogTitle>{t('Purchase Remaining Builds')}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">{t('Remap 10 Builds Package')}</Typography>
        <Box sx={{ ml: 3, mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item md={8}>
              {t('Item amount:')}
            </Grid>
            <Grid item md={4}>
              $1.50
            </Grid>
            <Grid item md={8}>
              {t('Tax amount:')}
            </Grid>
            <Grid item md={4}>
              $0.15
            </Grid>
            <Grid item md={8}>
              {t('Total amount:')}
            </Grid>
            <Grid item md={4}>
              $1.65
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Typography variant="caption">
            {t(
              'By purchasing the Remap 10 Builds Package, you can use the firmware workbench feature to build your custom firmware up to 10 times.'
            )}
          </Typography>
          <Typography variant="caption" gutterBottom>
            {t(
              'Make the most of this feature to customize your keyboard and make it more comfortable to use.'
            )}
          </Typography>
        </Box>
        <PayPalButtons
          style={{
            shape: 'rect',
            layout: 'vertical',
            color: 'blue',
            label: 'pay',
          }}
          createOrder={createOrder}
          onApprove={async (data, _actions) => {
            const orderId = data.orderID;
            if (orderId === undefined) {
              throw new Error('Order ID is undefined');
            }
            await captureOrder(orderId);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          {t('Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
