import firebase from 'firebase/app';

export const isAuthenticatedUserByAnonymous = (
  currentUser: firebase.User
): boolean => currentUser && currentUser.isAnonymous;

export const isAuthenticatedUserByGoogle = (
  currentUser: firebase.User
): boolean =>
  currentUser &&
  currentUser.providerData &&
  currentUser.providerData.some(
    (value) =>
      value !== null &&
      value.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
  );

export const isAuthenticatedUserByGitHub = (
  currentUser: firebase.User
): boolean =>
  currentUser &&
  currentUser.providerData &&
  currentUser.providerData.some(
    (value) =>
      value !== null &&
      value.providerId === firebase.auth.GithubAuthProvider.PROVIDER_ID
  );

export const isAuthenticatedUserBySocialLogin = (
  currentUser: firebase.User
): boolean =>
  isAuthenticatedUserByGoogle(currentUser) ||
  isAuthenticatedUserByGitHub(currentUser);
