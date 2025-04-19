import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { IStorage } from '../../../services/storage/Storage';
import { WorkbenchAppActions } from '../../../actions/workbench.action';

export const useBuildTaskHook = (
  projectId: string | undefined,
  storage: IStorage | null | undefined
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectId === undefined) {
      return;
    }
    if (storage === null || storage === undefined) {
      return;
    }
    const unsubscribe = storage.onSnapshotWorkbenchProjectBuildingTasks(
      projectId,
      (tasks) => {
        dispatch(WorkbenchAppActions.updateBuildingTasks(tasks));
      }
    );
    return () => {
      unsubscribe();
    };
  }, [projectId, dispatch, storage]);
};
