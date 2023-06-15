import { IOrganizationsPhase, RootState } from '../store/state';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { NotificationActions } from './actions';
import { StorageActions } from './storage.action';
import { IOrganizationMember, isError } from '../services/storage/Storage';

export const ORGANIZATIONS_APP_ACTIONS = '@Organizations!App';
export const ORGANIZATIONS_APP_UPDATE_PHASE = `${ORGANIZATIONS_APP_ACTIONS}/UpdatePhase`;
export const OrganizationsAppActions = {
  updatePhase: (phase: IOrganizationsPhase) => {
    return {
      type: ORGANIZATIONS_APP_UPDATE_PHASE,
      value: phase,
    };
  },
};

export const ORGANIZATIONS_EDIT_ORGANIZATION_ACTIONS =
  '@Organization!EditOrganization';
export const ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_ORGANIZATION_MEMBERS = `${ORGANIZATIONS_EDIT_ORGANIZATION_ACTIONS}/UpdateOrganizationMembers`;
export const ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_EMAIL = `${ORGANIZATIONS_EDIT_ORGANIZATION_ACTIONS}/UpdateEmail`;
export const OrganizationsEditOrganizationActions = {
  updateOrganizationMembers: (organizationMembers: IOrganizationMember[]) => {
    return {
      type: ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_ORGANIZATION_MEMBERS,
      value: organizationMembers,
    };
  },
  updateEmail: (email: string) => {
    return {
      type: ORGANIZATIONS_EDIT_ORGANIZATION_UPDATE_EMAIL,
      value: email,
    };
  },
};

type ActionTypes = ReturnType<
  | typeof OrganizationsAppActions[keyof typeof OrganizationsAppActions]
  | typeof OrganizationsEditOrganizationActions[keyof typeof OrganizationsEditOrganizationActions]
  | typeof NotificationActions[keyof typeof NotificationActions]
  | typeof StorageActions[keyof typeof StorageActions]
>;
type ThunkPromiseAction<T> = ThunkAction<
  Promise<T>,
  RootState,
  undefined,
  ActionTypes
>;
export const organizationsActionsThunk = {
  // eslint-disable-next-line no-undef
  logout:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { auth } = getState();
      dispatch(OrganizationsAppActions.updatePhase('signout'));
      await auth.instance!.signOut();
    },

  fetchMyOrganizations:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const fetchMyOrganizationsResult =
        await storage.instance!.fetchMyOrganizations();
      if (isError(fetchMyOrganizationsResult)) {
        console.error(fetchMyOrganizationsResult.error);
        dispatch(
          NotificationActions.addError(
            fetchMyOrganizationsResult.error,
            fetchMyOrganizationsResult.cause
          )
        );
        return;
      }
      dispatch(
        StorageActions.updateOrganizationMap(
          fetchMyOrganizationsResult.value.organizationMap
        )
      );
      dispatch(OrganizationsAppActions.updatePhase('list'));
    },

  fetchOrganization:
    (organizationId: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      const { storage } = getState();
      const fetchOrganizationResult =
        await storage.instance!.fetchOrganizationById(organizationId);
      if (isError(fetchOrganizationResult)) {
        console.error(fetchOrganizationResult.error);
        dispatch(
          NotificationActions.addError(
            fetchOrganizationResult.error,
            fetchOrganizationResult.cause
          )
        );
        return;
      }
      dispatch(
        StorageActions.updateOrganization(
          fetchOrganizationResult.value.organization
        )
      );
      const fetchOrganizationMembersResult =
        await storage.instance!.fetchOrganizationMembers(organizationId);
      if (isError(fetchOrganizationMembersResult)) {
        console.error(fetchOrganizationMembersResult.error);
        dispatch(
          NotificationActions.addError(
            fetchOrganizationMembersResult.error,
            fetchOrganizationMembersResult.cause
          )
        );
        return;
      }
      dispatch(
        OrganizationsEditOrganizationActions.updateOrganizationMembers(
          fetchOrganizationMembersResult.value.members
        )
      );
      dispatch(OrganizationsEditOrganizationActions.updateEmail(''));
      dispatch(OrganizationsAppActions.updatePhase('edit'));
    },

  addOrganizationMember:
    (): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      dispatch(OrganizationsAppActions.updatePhase('processing'));
      const { organizations, entities, storage } = getState();
      const email = organizations.editorganization.email;
      const organizationId = entities.organization!.id!;
      const addOrganizationMemberResult =
        await storage.instance!.addOrganizationMember(organizationId, email);
      if (isError(addOrganizationMemberResult)) {
        dispatch(OrganizationsAppActions.updatePhase('edit'));
        console.error(addOrganizationMemberResult.error);
        dispatch(
          NotificationActions.addError(
            addOrganizationMemberResult.error,
            addOrganizationMemberResult.cause
          )
        );
        return;
      }
      const fetchOrganizationMembersResult =
        await storage.instance!.fetchOrganizationMembers(organizationId);
      if (isError(fetchOrganizationMembersResult)) {
        dispatch(OrganizationsAppActions.updatePhase('edit'));
        console.error(fetchOrganizationMembersResult.error);
        dispatch(
          NotificationActions.addError(
            fetchOrganizationMembersResult.error,
            fetchOrganizationMembersResult.cause
          )
        );
        return;
      }
      dispatch(
        OrganizationsEditOrganizationActions.updateOrganizationMembers(
          fetchOrganizationMembersResult.value.members
        )
      );
      dispatch(OrganizationsEditOrganizationActions.updateEmail(''));
      dispatch(OrganizationsAppActions.updatePhase('edit'));
    },

  deleteOrganizationMember:
    (uid: string): ThunkPromiseAction<void> =>
    async (
      dispatch: ThunkDispatch<RootState, undefined, ActionTypes>,
      // eslint-disable-next-line no-unused-vars
      getState: () => RootState
    ) => {
      dispatch(OrganizationsAppActions.updatePhase('processing'));
      const { entities, storage } = getState();
      const organizationId = entities.organization!.id!;
      const deleteOrganizationMemberResult =
        await storage.instance!.deleteOrganizationMember(organizationId, uid);
      if (isError(deleteOrganizationMemberResult)) {
        dispatch(OrganizationsAppActions.updatePhase('edit'));
        console.error(deleteOrganizationMemberResult.error);
        dispatch(
          NotificationActions.addError(
            deleteOrganizationMemberResult.error,
            deleteOrganizationMemberResult.cause
          )
        );
        return;
      }
      const fetchOrganizationMembersResult =
        await storage.instance!.fetchOrganizationMembers(organizationId);
      if (isError(fetchOrganizationMembersResult)) {
        dispatch(OrganizationsAppActions.updatePhase('edit'));
        console.error(fetchOrganizationMembersResult.error);
        dispatch(
          NotificationActions.addError(
            fetchOrganizationMembersResult.error,
            fetchOrganizationMembersResult.cause
          )
        );
        return;
      }
      dispatch(
        OrganizationsEditOrganizationActions.updateOrganizationMembers(
          fetchOrganizationMembersResult.value.members
        )
      );
      dispatch(OrganizationsEditOrganizationActions.updateEmail(''));
      dispatch(OrganizationsAppActions.updatePhase('edit'));
    },
};
