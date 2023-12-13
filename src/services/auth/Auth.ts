import firebase from 'firebase/app';
import 'firebase/auth';
import { IEmptyResult, IResult } from '../storage/Storage';

export interface IAuth {
  signInWithGitHub(): Promise<void>;
  signInWithGitHubWithPopup(): Promise<IEmptyResult>;
  signInWithGoogleWithPopup(): Promise<IEmptyResult>;
  linkToGoogleWithPopup(): Promise<IEmptyResult>;
  linkToGitHubWithPopup(): Promise<IEmptyResult>;
  signInAsAnonymousUser(): Promise<IResult<firebase.User>>;
  linkToGitHub(): Promise<void>;
  subscribeAuthStatus(
    // eslint-disable-next-line no-unused-vars
    callback: (user: firebase.User | null) => Promise<void>
  ): void;
  getCurrentAuthenticatedUser(): firebase.User | null;
  getCurrentAuthenticatedUserOrThrow(): firebase.User;
  getCurrentAuthenticatedUserDisplayName(): string;
  signOut(): Promise<void>;
}

export type IGetProviderDataResult = {
  exists: boolean;
  userInfo?: firebase.UserInfo;
};

export const getGitHubProviderData = (
  user: firebase.User
): IGetProviderDataResult => {
  return getConcreteProviderData(
    user,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  );
};

export const getGoogleProviderData = (
  user: firebase.User
): IGetProviderDataResult => {
  return getConcreteProviderData(
    user,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  );
};

const getConcreteProviderData = (
  user: firebase.User,
  providerId: string
): IGetProviderDataResult => {
  const providerDataList = user.providerData;
  const providerData = providerDataList.find(
    (data) => data?.providerId === providerId
  );
  if (providerData) {
    return {
      exists: true,
      userInfo: providerData,
    };
  } else {
    return {
      exists: false,
    };
  }
};
