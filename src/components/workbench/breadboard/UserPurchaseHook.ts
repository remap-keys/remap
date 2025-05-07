import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IStorage } from '../../../services/storage/Storage';
import { AppActions } from '../../../actions/actions';

export const useUserPurchaseHook = (storage: IStorage | null | undefined) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (storage === null || storage === undefined) {
      return;
    }
    const unsubscribe = storage.onSnapshotUserPurchase((purchase) => {
      dispatch(AppActions.updateUserPurchase(purchase));
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch, storage]);
};
