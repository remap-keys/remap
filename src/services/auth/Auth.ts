import firebase from 'firebase';

export interface IAuth {
  signInWithGitHub(): Promise<void>;
  // eslint-disable-next-line no-unused-vars
  subscribeAuthStatus(callback: (user: firebase.User | null) => void): void;
  getCurrentAuthenticatedUser(): firebase.User;
  signOutFromGitHub(): Promise<void>;
}

export type IGetProviderDataResult = {
  exists: boolean;
  userInfo?: firebase.UserInfo;
};

export const getGitHubProviderData = (
  user: firebase.User
): IGetProviderDataResult => {
  const providerData = user.providerData;
  const githubProviderData = providerData.find(
    (data) => data?.providerId === 'github.com'
  );
  if (githubProviderData) {
    return {
      exists: true,
      userInfo: githubProviderData,
    };
  } else {
    return {
      exists: false,
    };
  }
};
