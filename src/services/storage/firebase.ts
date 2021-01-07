import firebase from 'firebase';
import 'firebase/firestore';
import { IFetchKeyboardDefinitionResult, IStorage } from './storage';

const config = {
  apiKey: 'AIzaSyDiEpH2Bbf1ZO63ZiJM3SeyD2LR0IeyM1s',
  authDomain: 'remap-4f4d9.firebaseapp.com',
  projectId: 'remap-4f4d9',
  storageBucket: 'remap-4f4d9.appspot.com',
  messagingSenderId: '981855678093',
  appId: '1:981855678093:web:f293b8e994e6952377bcc4',
};

export class FirestoreStorage implements IStorage {
  private db: firebase.firestore.Firestore;

  constructor() {
    firebase.initializeApp(config);
    const app = firebase.app();
    this.db = app.firestore();
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
}
