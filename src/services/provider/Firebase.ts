import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import { IFetchKeyboardDefinitionResult, IStorage } from '../storage/Storage';
import { IAuth } from '../auth/Auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export class FirebaseProvider implements IStorage, IAuth {
  private db: firebase.firestore.Firestore;
  private auth: firebase.auth.Auth;
  private unsubscribeAuthStateChanged?: firebase.Unsubscribe;

  constructor() {
    firebase.initializeApp(config);
    const app = firebase.app();
    this.db = app.firestore();
    this.auth = app.auth();
  }

  async fetchKeyboardDefinition(
    vendorId: number,
    productId: number
  ): Promise<IFetchKeyboardDefinitionResult> {
    try {
      const querySnapshot = await this.db
        .collection('keyboards')
        .where('vendor_id', '==', vendorId)
        .where('product_id', '==', productId)
        .get();
      if (querySnapshot.empty) {
        return {
          success: true,
          exists: false,
        };
      } else if (querySnapshot.size !== 1) {
        throw new Error(
          `There are duplicate keyboard definition documents: ${vendorId}:${productId}`
        );
      } else {
        return {
          success: true,
          exists: true,
          document: {
            id: querySnapshot.docs[0].id,
            name: querySnapshot.docs[0].data().name,
            vendorId: querySnapshot.docs[0].data().vendor_id,
            productId: querySnapshot.docs[0].data().product_id,
            json: querySnapshot.docs[0].data().json,
          },
        };
      }
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: 'Fetching the keyboard definition document failed',
        cause: error,
      };
    }
  }

  async fetchClosedBetaUsers(): Promise<string[]> {
    const documentSnapshot = await this.db
      .collection('configurations')
      .doc('closedbeta')
      .get();
    if (documentSnapshot.exists) {
      return documentSnapshot.data()!.users;
    } else {
      return [];
    }
  }

  signInWithGitHubForClosedBeta(): Promise<void> {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.auth.signInWithRedirect(provider);
  }

  // eslint-disable-next-line no-unused-vars
  subscribeAuthStatus(callback: (user: firebase.User | null) => void): void {
    this.unsubscribeAuthStateChanged && this.unsubscribeAuthStateChanged();
    this.unsubscribeAuthStateChanged = this.auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        callback(user);
      }
    );
  }
}
