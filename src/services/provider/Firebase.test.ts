import { FirebaseProvider } from './Firebase';
import firebase from 'firebase/app';
import * as sinon from 'sinon';

describe('FirebaseProvider', () => {
  test('createFirmwareFilename', () => {
    const keyboardName = 'keyboard-name-1';
    const firmwareFile = new File([], 'firmware-file-1.hex');
    const timestamp = 12345;
    const actual = FirebaseProvider.createFirmwareFilename(
      keyboardName,
      firmwareFile,
      timestamp
    );
    expect(actual).toEqual('keyboard-name-1-12345.hex');
  });

  describe('getCurrentAuthenticatedUserDisplayName', () => {
    test('user.displayName', () => {
      const subject: FirebaseProvider = {
        getCurrentAuthenticatedUserIgnoreNull(): firebase.User {
          return {
            displayName: 'displayName1',
          } as firebase.User;
        },
      } as FirebaseProvider;
      subject.getCurrentAuthenticatedUserDisplayName =
        FirebaseProvider.prototype.getCurrentAuthenticatedUserDisplayName;
      expect(subject.getCurrentAuthenticatedUserDisplayName()).toEqual(
        'displayName1'
      );
    });

    test('user.providerData[0].displayName', () => {
      const subject: FirebaseProvider = {
        getCurrentAuthenticatedUserIgnoreNull(): firebase.User {
          return {
            displayName: null,
            providerData: [{ displayName: 'displayName2' }],
          } as firebase.User;
        },
      } as FirebaseProvider;
      subject.getCurrentAuthenticatedUserDisplayName =
        FirebaseProvider.prototype.getCurrentAuthenticatedUserDisplayName;
      expect(subject.getCurrentAuthenticatedUserDisplayName()).toEqual(
        'displayName2'
      );
    });

    test('user.email', () => {
      const subject: FirebaseProvider = {
        getCurrentAuthenticatedUserIgnoreNull(): firebase.User {
          return {
            displayName: null,
            providerData: [{ displayName: null }],
            email: 'displayName3@example.com',
          } as firebase.User;
        },
      } as FirebaseProvider;
      subject.getCurrentAuthenticatedUserDisplayName =
        FirebaseProvider.prototype.getCurrentAuthenticatedUserDisplayName;
      expect(subject.getCurrentAuthenticatedUserDisplayName()).toEqual(
        'displayName3'
      );
    });

    test('user.email', () => {
      const subject: FirebaseProvider = {
        getCurrentAuthenticatedUserIgnoreNull(): firebase.User {
          return {
            displayName: null,
            providerData: [{ displayName: null }],
            email: 'displayName3@example.com',
          } as firebase.User;
        },
      } as FirebaseProvider;
      subject.getCurrentAuthenticatedUserDisplayName =
        FirebaseProvider.prototype.getCurrentAuthenticatedUserDisplayName;
      expect(subject.getCurrentAuthenticatedUserDisplayName()).toEqual(
        'displayName3'
      );
    });

    test('noname', () => {
      const subject: FirebaseProvider = {
        getCurrentAuthenticatedUserIgnoreNull(): firebase.User {
          return {
            displayName: null,
            providerData: [{ displayName: null }],
            email: null,
          } as firebase.User;
        },
      } as FirebaseProvider;
      subject.getCurrentAuthenticatedUserDisplayName =
        FirebaseProvider.prototype.getCurrentAuthenticatedUserDisplayName;
      expect(subject.getCurrentAuthenticatedUserDisplayName()).toEqual(
        '(no name)'
      );
    });
  });
});
