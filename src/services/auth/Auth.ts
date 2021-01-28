import firebase from 'firebase';

export interface IAuth {
  signInWithGitHub(): Promise<void>;
  subscribeAuthStatus(callback: (user: firebase.User | null) => void): void;
  getCurrentAuthenticatedUser(): firebase.User;
}
