import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import 'firebase/storage';
import 'firebase/functions';
import {
  ICreateKeyboardDefinitionDocumentResult,
  IFetchKeyboardDefinitionDocumentResult,
  IFetchMyKeyboardDefinitionDocumentsResult,
  IKeyboardDefinitionDocument,
  IKeyboardDefinitionStatus,
  IStorage,
  SavedKeymapData,
  ISavedKeymapResult,
  AbstractKeymapData,
  AppliedKeymapData,
  IAppliedKeymapsResult,
  isAppliedKeymapDataInstance,
  IStore,
  IFetchSharedKeymapResult,
  IAdditionalDescription,
  ISubImage,
  IFirmware,
  IFetchFirmwareFileBlobResult,
  IFirmwareCounterType,
  IFetchOrganizationByIdResult,
  IOrganization,
  IFetchOrganizationsByIdsResult,
  IFetchMyOrganizationsResult,
  IKeyboardDefinitionAuthorType,
  IFetchOrganizationMembersResult,
  IFetchAllOrganizationsResult,
  successResultOf,
  errorResultOf,
  IEmptyResult,
  successResult,
  IResult,
  IBuildableFirmware,
  IBuildableFirmwareFileType,
  IBuildableFirmwareFile,
  isError,
} from '../storage/Storage';
import { IAuth, IAuthenticationResult } from '../auth/Auth';
import { IFirmwareCodePlace, IKeyboardFeatures } from '../../store/state';
import { IDeviceInformation } from '../hid/Hid';
import * as crypto from 'crypto';
import { IBootloaderType } from '../firmware/Types';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const FUNCTIONS_REGION = 'asia-northeast1';

export class FirebaseProvider implements IStorage, IAuth {
  private db: firebase.firestore.Firestore;
  private auth: firebase.auth.Auth;
  private storage: firebase.storage.Storage;
  private functions: firebase.functions.Functions;
  private unsubscribeAuthStateChanged?: firebase.Unsubscribe;

  constructor() {
    firebase.initializeApp(config);
    firebase.analytics();
    const app = firebase.app();
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage = app.storage();
    this.functions = app.functions(FUNCTIONS_REGION);
  }

  private createResult(
    documentSnapshot: firebase.firestore.QueryDocumentSnapshot
  ): IFetchKeyboardDefinitionDocumentResult {
    return successResultOf({
      exists: true,
      document: this.generateKeyboardDefinitionDocument(documentSnapshot),
    });
  }

  private generateKeyboardDefinitionDocument(
    documentSnapshot: firebase.firestore.DocumentSnapshot
  ): IKeyboardDefinitionDocument {
    const firmwares: IFirmware[] = [];
    if (documentSnapshot.data()!.firmwares) {
      documentSnapshot.data()!.firmwares.forEach((firmware: any) => {
        firmwares.push({
          name: firmware.name,
          description: firmware.description,
          hash: firmware.hash,
          filename: firmware.filename,
          sourceCodeUrl: firmware.source_code_url,
          created_at: firmware.created_at.toDate(),
          flash_support: firmware.flash_support || false,
          default_bootloader_type:
            firmware.default_bootloader_type || 'caterina',
        });
      });
    }
    return {
      id: documentSnapshot.id,
      name: documentSnapshot.data()!.name,
      vendorId: documentSnapshot.data()!.vendor_id,
      productId: documentSnapshot.data()!.product_id,
      productName: documentSnapshot.data()!.product_name,
      authorUid: documentSnapshot.data()!.author_uid,
      authorType: documentSnapshot.data()!.author_type || 'individual',
      organizationId: documentSnapshot.data()!.organization_id,
      status: documentSnapshot.data()!.status,
      json: documentSnapshot.data()!.json,
      rejectReason: documentSnapshot.data()!.reject_reason,
      githubDisplayName: documentSnapshot.data()!.github_display_name,
      githubUrl: documentSnapshot.data()!.github_url,
      firmwareCodePlace: documentSnapshot.data()!.firmware_code_place,
      qmkRepositoryFirstPullRequestUrl:
        documentSnapshot.data()!.qmk_repository_first_pull_request_url,
      forkedRepositoryUrl: documentSnapshot.data()!.forked_repository_url,
      forkedRepositoryEvidence:
        documentSnapshot.data()!.forked_repository_evidence,
      otherPlaceHowToGet: documentSnapshot.data()!.other_place_how_to_get,
      otherPlaceSourceCodeEvidence:
        documentSnapshot.data()!.other_place_source_code_evidence,
      otherPlacePublisherEvidence:
        documentSnapshot.data()!.other_place_publisher_evidence,
      organizationEvidence: documentSnapshot.data()!.organization_evidence,
      contactInformation: documentSnapshot.data()!.contact_information,
      features: documentSnapshot.data()!.features || [],
      thumbnailImageUrl: documentSnapshot.data()!.thumbnail_image_url,
      imageUrl: documentSnapshot.data()!.image_url,
      subImages: documentSnapshot.data()!.sub_images || [],
      description: documentSnapshot.data()!.description || '',
      additionalDescriptions:
        documentSnapshot.data()!.additional_descriptions || [],
      stores: documentSnapshot.data()!.stores || [],
      websiteUrl: documentSnapshot.data()!.website_url || '',
      firmwares,
      totalFirmwareDownloadCount:
        documentSnapshot.data()!.total_firmware_download_count || 0,
      totalFirmwareFlashCount:
        documentSnapshot.data()!.total_firmware_flash_count || 0,
      createdAt: documentSnapshot.data()!.created_at.toDate(),
      updatedAt: documentSnapshot.data()!.updated_at.toDate(),
    };
  }

  async fetchMyKeyboardDefinitionDocumentById(
    definitionId: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult> {
    try {
      const documentSnapshot = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .get();
      if (documentSnapshot.exists) {
        return successResultOf({
          exists: true,
          document: this.generateKeyboardDefinitionDocument(documentSnapshot),
        });
      } else {
        return successResultOf({
          exists: false,
        });
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Fetching the keyboard definition document failed',
        error
      );
    }
  }

  async fetchMyKeyboardDefinitionDocuments(): Promise<IFetchMyKeyboardDefinitionDocumentsResult> {
    try {
      const definitionMap: Record<string, IKeyboardDefinitionDocument> = {};
      const fetchMyDefinitionDocumentResult = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .where('author_type', '==', 'individual')
        .where('author_uid', '==', this.auth.currentUser!.uid)
        .get();
      fetchMyDefinitionDocumentResult.forEach((doc) => {
        definitionMap[doc.id] = this.generateKeyboardDefinitionDocument(doc);
      });
      const fetchMyOrganizationsResult = await this.db
        .collection('organizations')
        .doc('v1')
        .collection('profiles')
        .where('members', 'array-contains', this.auth.currentUser!.uid)
        .get();
      for (const doc of fetchMyOrganizationsResult.docs) {
        const fetchDefinitionDocumentByOrganizationIdResult = await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('author_type', '==', 'organization')
          .where('organization_id', '==', doc.id)
          .get();
        fetchDefinitionDocumentByOrganizationIdResult.forEach((doc) => {
          definitionMap[doc.id] = this.generateKeyboardDefinitionDocument(doc);
        });
      }
      return successResultOf({
        documents: Object.values(definitionMap).sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        ),
      });
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Fetching the keyboard definition document failed',
        error
      );
    }
  }

  async fetchKeyboardDefinitionDocumentByDeviceInfo(
    vendorId: number,
    productId: number,
    productName: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult> {
    try {
      const querySnapshotByVidAndPid = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .where('vendor_id', '==', vendorId)
        .where('product_id', '==', productId)
        .where('status', '==', 'approved')
        .get();
      let docs = querySnapshotByVidAndPid.docs;
      if (docs.length > 1) {
        docs = docs.filter((doc) =>
          productName.endsWith(doc.data().product_name)
        );
      }
      if (docs.length === 0) {
        console.warn(
          `Keyboard definition not found: ${vendorId}:${productId}:${productName}`
        );
        return successResultOf({
          exists: false,
        });
      } else if (docs.length > 1) {
        return errorResultOf(
          `There are duplicate keyboard definition documents: ${vendorId}:${productId}:${productName}`
        );
      } else {
        return this.createResult(docs[0]);
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Fetching the keyboard definition document failed',
        error
      );
    }
  }

  async updateKeyboardDefinitionJson(
    definitionId: string,
    name: string,
    jsonStr: string
  ): Promise<IEmptyResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update({
          json: jsonStr,
          name,
          updated_at: now,
        });
      return successResult();
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Updating the Keyboard Definition JSON content failed.',
        error
      );
    }
  }

  async updateKeyboardDefinitionDocument(
    definitionId: string,
    name: string,
    vendorId: number,
    productId: number,
    productName: string,
    jsonStr: string,
    firmwareCodePlace: IFirmwareCodePlace,
    qmkRepositoryFirstPullRequestUrl: string,
    forkedRepositoryUrl: string,
    forkedRepositoryEvidence: string,
    otherPlaceHowToGet: string,
    otherPlaceSourceCodeEvidence: string,
    otherPlacePublisherEvidence: string,
    contactInformation: string | undefined,
    organizationEvidence: string,
    authorType: IKeyboardDefinitionAuthorType,
    organizationId: string | undefined,
    status: IKeyboardDefinitionStatus
  ): Promise<IEmptyResult> {
    try {
      const now = new Date();
      const data: any = {
        updated_at: now,
        json: jsonStr,
        name,
        product_id: productId,
        vendor_id: vendorId,
        product_name: productName,
        firmware_code_place: firmwareCodePlace,
        qmk_repository_first_pull_request_url: qmkRepositoryFirstPullRequestUrl,
        forked_repository_url: forkedRepositoryUrl,
        forked_repository_evidence: forkedRepositoryEvidence,
        other_place_how_to_get: otherPlaceHowToGet,
        other_place_source_code_evidence: otherPlaceSourceCodeEvidence,
        other_place_publisher_evidence: otherPlacePublisherEvidence,
        author_type: authorType,
        status,
      };
      if (contactInformation) {
        data.contact_information = contactInformation;
      }
      if (authorType === 'organization') {
        data.organization_id = organizationId;
        data.organization_evidence = organizationEvidence || '';
      }
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update(data);
      return successResult();
    } catch (error) {
      console.error(error);
      return errorResultOf('Updating the Keyboard Definition failed.', error);
    }
  }

  async updateKeyboardDefinitionDocumentForCatalog(
    definitionId: string,
    features: IKeyboardFeatures[],
    description: string,
    stores: IStore[],
    websiteUrl: string,
    additionalDescriptions: IAdditionalDescription[]
  ): Promise<IEmptyResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update({
          updated_at: now,
          features,
          description,
          stores,
          website_url: websiteUrl,
          additional_descriptions: additionalDescriptions,
        });
      return successResult();
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Updating the Keyboard Definition for Catalog failed.',
        error
      );
    }
  }

  async createKeyboardDefinitionDocument(
    authorUid: string,
    name: string,
    vendorId: number,
    productId: number,
    productName: string,
    jsonStr: string,
    githubUid: string,
    githubDisplayName: string,
    githubEmail: string,
    githubUrl: string,
    firmwareCodePlace: IFirmwareCodePlace,
    qmkRepositoryFirstPullRequestUrl: string,
    forkedRepositoryUrl: string,
    forkedRepositoryEvidence: string,
    otherPlaceHowToGet: string,
    otherPlaceSourceCodeEvidence: string,
    otherPlacePublisherEvidence: string,
    contactInformation: string,
    organizationEvidence: string,
    authorType: IKeyboardDefinitionAuthorType,
    organizationId: string | undefined,
    status: IKeyboardDefinitionStatus
  ): Promise<ICreateKeyboardDefinitionDocumentResult> {
    try {
      const now = new Date();
      const data: any = {
        author_uid: authorUid,
        created_at: now,
        updated_at: now,
        json: jsonStr,
        name,
        product_id: productId,
        vendor_id: vendorId,
        product_name: productName,
        status,
        github_display_name: githubDisplayName,
        github_url: githubUrl,
        firmware_code_place: firmwareCodePlace,
        qmk_repository_first_pull_request_url: qmkRepositoryFirstPullRequestUrl,
        forked_repository_url: forkedRepositoryUrl,
        forked_repository_evidence: forkedRepositoryEvidence,
        other_place_how_to_get: otherPlaceHowToGet,
        other_place_source_code_evidence: otherPlaceSourceCodeEvidence,
        other_place_publisher_evidence: otherPlacePublisherEvidence,
        contact_information: contactInformation,
        author_type: authorType,
      };
      if (authorType === 'organization') {
        data.organization_id = organizationId;
        data.organization_evidence = organizationEvidence || '';
      }
      const definitionDocumentReference = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .add(data);
      await definitionDocumentReference.collection('secure').doc('github').set({
        github_display_name: githubDisplayName,
        github_email: githubEmail,
        github_uid: githubUid,
      });
      return successResultOf({
        definitionId: definitionDocumentReference.id,
      });
    } catch (error) {
      console.error(error);
      return errorResultOf('Creating a new Keyboard Definition failed.', error);
    }
  }

  async deleteKeyboardDefinitionDocument(
    definitionId: string
  ): Promise<IEmptyResult> {
    try {
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .collection('secure')
        .doc('github')
        .delete();
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .delete();
      return successResult();
    } catch (error) {
      console.error(error);
      return errorResultOf('Deleting the keyboard definition failed.', error);
    }
  }

  signInWithGitHub(): Promise<void> {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.auth.signInWithRedirect(provider);
  }

  linkToGitHub(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const provider = new firebase.auth.GithubAuthProvider();
      return currentUser.linkWithRedirect(provider);
    } else {
      throw new Error('Invalid situation. Not signed in.');
    }
  }

  async signInWithGitHubWithPopup(): Promise<IAuthenticationResult> {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const userCredential = await this.auth.signInWithPopup(provider);
      if (userCredential) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: 'Authenticating with GitHub Account failed.',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        cause: err,
      };
    }
  }

  async signInWithGoogleWithPopup(): Promise<IAuthenticationResult> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.auth.signInWithPopup(provider);
      if (userCredential) {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
          error: 'Authenticating with Google Account failed.',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
        cause: err,
      };
    }
  }

  async linkToGoogleWithPopup(): Promise<IAuthenticationResult> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await currentUser.linkWithPopup(provider);
        if (userCredential) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Linking to Google Account failed.',
          };
        }
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
          cause: err,
        };
      }
    } else {
      return {
        success: false,
        error: 'Not authenticated yet.',
      };
    }
  }

  async linkToGitHubWithPopup(): Promise<IAuthenticationResult> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      try {
        const provider = new firebase.auth.GithubAuthProvider();
        const userCredential = await currentUser.linkWithPopup(provider);
        if (userCredential) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
            error: 'Linking to GitHub Account failed.',
          };
        }
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
          cause: err,
        };
      }
    } else {
      return {
        success: false,
        error: 'Not authenticated yet.',
      };
    }
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

  getCurrentAuthenticatedUser(): firebase.User {
    return this.auth.currentUser!;
  }

  getCurrentAuthenticatedUserDisplayName(): string {
    const user = this.getCurrentAuthenticatedUser();
    let displayName: string | undefined | null = user.displayName;
    if (displayName) {
      return displayName;
    }
    for (const userInfo of user.providerData) {
      displayName = userInfo?.displayName;
      if (displayName) {
        return displayName;
      }
    }
    const email = user.email;
    if (email && 0 < email.indexOf('@')) {
      return email.substring(0, email.indexOf('@'));
    }
    return '(no name)';
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  /**
   * Fetch my owned keymaps, regardless of status.
   */
  async fetchMySavedKeymaps(
    info: IDeviceInformation
  ): Promise<ISavedKeymapResult> {
    const snapshot = await this.db
      .collection('keymaps')
      .doc('v1')
      .collection('saved-keymaps')
      .where('author_uid', '==', this.auth.currentUser!.uid)
      .where('vendor_id', '==', info.vendorId)
      .where('product_id', '==', info.productId)
      .orderBy('created_at', 'asc')
      .get();
    const keymaps: SavedKeymapData[] = this.filterKeymapsByProductName(
      snapshot,
      info
    );
    return successResultOf({
      savedKeymaps: keymaps,
    });
  }

  async fetchSharedKeymaps(
    info: IDeviceInformation,
    withoutMine: boolean
  ): Promise<ISavedKeymapResult> {
    const snapshot = await this.db
      .collection('keymaps')
      .doc('v1')
      .collection('saved-keymaps')
      .where('status', '==', 'shared')
      .where('vendor_id', '==', info.vendorId)
      .where('product_id', '==', info.productId)
      .orderBy('created_at', 'desc')
      .get();
    let keymaps: SavedKeymapData[] =
      this.filterKeymapsByProductName<SavedKeymapData>(snapshot, info);
    if (withoutMine) {
      keymaps = keymaps.filter(
        (keymap) => keymap.author_uid !== this.auth.currentUser!.uid
      );
    }
    return successResultOf({
      savedKeymaps: keymaps,
    });
  }

  filterKeymapsByProductName<T extends AbstractKeymapData>(
    snapshot: firebase.firestore.QuerySnapshot,
    info: IDeviceInformation
  ): T[] {
    const deviceProductName = info.productName;
    const keymaps: T[] = [];
    snapshot.docs.forEach((doc) => {
      const data: T = {
        id: doc.id,
        ...(doc.data() as T),
      };
      const savedProductName = data.product_name;

      /**
       * The device's ProductName might be different by using OS.
       * This is the WebHID bug.
       * https://bugs.chromium.org/p/chromium/issues/detail?id=1167093
       *
       * The ProductName is defined text by #PRODUCT in config.h/info.h.
       * However with Linux, the ProductName is a combination of defined text with #MANUFACTURER and #PRODUCT.
       *
       * ex)
       * Lunakey Mini (macOS, Windows)
       * yoichiro Lunakey Mini (Linux)
       *
       * This is why we need to filter the data by ProductName here.
       */
      if (
        deviceProductName.endsWith(savedProductName) ||
        savedProductName.endsWith(deviceProductName)
      ) {
        keymaps.push(data);
      }
    });
    return keymaps;
  }

  async createSavedKeymap(keymapData: SavedKeymapData): Promise<IEmptyResult> {
    try {
      const now = new Date();
      await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .add({
          ...keymapData,
          created_at: now,
          updated_at: now,
        });

      return successResult();
    } catch (error) {
      return errorResultOf('Creating a new Keymap failed.', error);
    }
  }

  async updateSavedKeymap(keymapData: SavedKeymapData): Promise<IEmptyResult> {
    try {
      const now = new Date();
      const keymapDataId = keymapData.id!;
      await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .doc(keymapDataId)
        .update({
          title: keymapData.title,
          desc: keymapData.desc,
          status: keymapData.status,
          author_display_name: keymapData.author_display_name,
          updated_at: now,
        });

      return successResult();
    } catch (error) {
      return errorResultOf('Updating a new Keymap failed.', error);
    }
  }

  async deleteSavedKeymap(keymapId: string): Promise<IEmptyResult> {
    try {
      await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .doc(keymapId)
        .delete();

      return successResult();
    } catch (error) {
      return errorResultOf('Deleting a new Keymap failed.', error);
    }
  }

  async createOrUpdateAppliedKeymap(
    keymapData: AbstractKeymapData
  ): Promise<IEmptyResult> {
    try {
      const savedKeymapId = isAppliedKeymapDataInstance(keymapData)
        ? (keymapData as AppliedKeymapData).saved_keymap_id
        : keymapData.id;
      const appliedKeymapsSnapshot = await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('applied-keymaps')
        .where('applied_uid', '==', this.auth.currentUser!.uid)
        .where('saved_keymap_id', '==', savedKeymapId)
        .get();
      if (appliedKeymapsSnapshot.empty) {
        // Create
        const now = new Date();
        const appliedKeymapData: AppliedKeymapData = {
          applied_uid: this.auth.currentUser!.uid,
          saved_keymap_id: savedKeymapId!,
          author_uid: keymapData.author_uid,
          author_display_name: keymapData.author_display_name,
          vendor_id: keymapData.vendor_id,
          product_id: keymapData.product_id,
          product_name: keymapData.product_name,
          title: keymapData.title,
          desc: keymapData.desc,
          label_lang: keymapData.label_lang,
          layout_options: keymapData.layout_options,
          keycodes: keymapData.keycodes,
          encoderKeycodes: keymapData.encoderKeycodes,
          created_at: now,
          updated_at: now,
        };
        await this.db
          .collection('keymaps')
          .doc('v1')
          .collection('applied-keymaps')
          .add(appliedKeymapData);
        return successResult();
      } else if (appliedKeymapsSnapshot.size === 1) {
        // Update
        const appliedKeymapDoc = appliedKeymapsSnapshot.docs[0];
        await this.db
          .collection('keymaps')
          .doc('v1')
          .collection('applied-keymaps')
          .doc(appliedKeymapDoc.id)
          .update({
            author_display_name: keymapData.author_display_name,
            title: keymapData.title,
            desc: keymapData.desc,
            label_lang: keymapData.label_lang,
            layout_options: keymapData.layout_options,
            keycodes: keymapData.keycodes,
            encoderKeycodes: keymapData.encoderKeycodes,
            updated_at: new Date(),
          });
        return successResult();
      } else {
        return errorResultOf(
          `Duplicated applied-keymap data found. The count is ${appliedKeymapsSnapshot.size}`
        );
      }
    } catch (error) {
      return errorResultOf(
        'Creating or updating an applied Keymap failed.',
        error
      );
    }
  }

  async fetchMyAppliedKeymaps(
    info: IDeviceInformation
  ): Promise<IAppliedKeymapsResult> {
    const snapshot = await this.db
      .collection('keymaps')
      .doc('v1')
      .collection('applied-keymaps')
      .where('applied_uid', '==', this.auth.currentUser!.uid)
      .where('vendor_id', '==', info.vendorId)
      .where('product_id', '==', info.productId)
      .orderBy('updated_at', 'desc')
      .get();
    const keymaps: AppliedKeymapData[] = this.filterKeymapsByProductName(
      snapshot,
      info
    );
    return successResultOf({
      appliedKeymaps: keymaps,
    });
  }

  async fetchSharedKeymap(keymapId: string): Promise<IFetchSharedKeymapResult> {
    try {
      const keymapSnapshot = await this.db
        .collection('keymaps')
        .doc('v1')
        .collection('saved-keymaps')
        .doc(keymapId)
        .get();
      if (keymapSnapshot.exists) {
        const data: SavedKeymapData = {
          id: keymapSnapshot.id,
          ...(keymapSnapshot.data() as SavedKeymapData),
        };
        return successResultOf({
          sharedKeymap: data,
        });
      } else {
        return errorResultOf(`Shared keymap data [${keymapId}] not found.`);
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Fetching shared keymap [${keymapId}] failed.`,
        error
      );
    }
  }

  async searchKeyboards(
    features: IKeyboardFeatures[],
    organizationId: string | undefined
  ): Promise<IFetchMyKeyboardDefinitionDocumentsResult> {
    try {
      let query;
      if (features.length === 0) {
        query = this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('status', '==', 'approved');
      } else {
        query = this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('features', 'array-contains-any', features)
          .where('status', '==', 'approved');
      }
      if (organizationId) {
        query = query.where('organization_id', '==', organizationId);
      }
      const querySnapshot = await query.get();
      return successResultOf({
        documents: querySnapshot.docs.map((queryDocumentSnapshot) =>
          this.generateKeyboardDefinitionDocument(queryDocumentSnapshot)
        ),
      });
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Searching the keyboard definition document with features failed',
        error
      );
    }
  }

  async fetchKeyboardDefinitionDocumentById(
    definitionId: string
  ): Promise<IFetchKeyboardDefinitionDocumentResult> {
    try {
      const documentSnapshot = await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .get();
      if (documentSnapshot.exists) {
        return successResultOf({
          exists: true,
          document: this.generateKeyboardDefinitionDocument(documentSnapshot),
        });
      } else {
        return errorResultOf(
          `The keyboard definition [${definitionId}] not found`
        );
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Fetching the keyboard definition document failed',
        error
      );
    }
  }

  async fetchKeyboardsCreatedBySameAuthor(
    definitionDocument: IKeyboardDefinitionDocument
  ): Promise<IFetchMyKeyboardDefinitionDocumentsResult> {
    try {
      if (definitionDocument.authorType === 'individual') {
        const querySnapshot = await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('status', '==', 'approved')
          .where('author_type', '==', 'individual')
          .where('author_uid', '==', definitionDocument.authorUid)
          .get();
        return successResultOf({
          documents: querySnapshot.docs.map((queryDocumentSnapshot) =>
            this.generateKeyboardDefinitionDocument(queryDocumentSnapshot)
          ),
        });
      } else {
        const querySnapshot = await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .where('status', '==', 'approved')
          .where('author_type', '==', 'organization')
          .where('organization_id', '==', definitionDocument.organizationId)
          .get();
        return successResultOf({
          documents: querySnapshot.docs.map((queryDocumentSnapshot) =>
            this.generateKeyboardDefinitionDocument(queryDocumentSnapshot)
          ),
        });
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        'Fetching the keyboards created by same author failed',
        error
      );
    }
  }

  async uploadFirmware(
    definitionId: string,
    firmwareFile: File,
    firmwareName: string,
    firmwareDescription: string,
    firmwareSourceCodeUrl: string,
    flashSupport: boolean,
    defaultBootloaderType: IBootloaderType,
    keyboardName: string,
    // eslint-disable-next-line no-unused-vars
    progress?: (uploadedRate: number) => void
  ): Promise<IEmptyResult> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IEmptyResult>((resolve, reject) => {
      const filename = FirebaseProvider.createFirmwareFilename(
        keyboardName,
        firmwareFile,
        new Date().getTime()
      );
      const filePath = `/firmware/${this.auth.currentUser!.uid}/${filename}`;
      const uploadTask = this.storage.ref(filePath).put(firmwareFile);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          if (progress) {
            const rate =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress(rate);
          }
        },
        (error) => {
          console.error(error);
          resolve(errorResultOf('Uploading firmware file failed.', error));
        },
        async () => {
          const hash = crypto
            .createHash('sha256')
            .update(new Uint8Array(await firmwareFile.arrayBuffer()))
            .digest('hex');
          const data: any = {
            name: firmwareName,
            description: firmwareDescription,
            source_code_url: firmwareSourceCodeUrl,
            created_at: new Date(),
            filename: filePath,
            hash,
            flash_support: flashSupport,
            default_bootloader_type: defaultBootloaderType,
          };
          await this.db
            .collection('keyboards')
            .doc('v2')
            .collection('definitions')
            .doc(definitionId)
            .update({
              firmwares: firebase.firestore.FieldValue.arrayUnion(data),
            });
          resolve(successResult());
        }
      );
    });
  }

  static createFirmwareFilename(
    keyboardName: string,
    firmwareFile: File,
    timestamp: number
  ): string {
    const extname = firmwareFile.name.substring(
      firmwareFile.name.lastIndexOf('.') + 1
    );
    return `${keyboardName}-${timestamp}.${extname}`;
  }

  async fetchFirmwareFileBlob(
    definitionId: string,
    firmwareFilePath: string,
    firmwareCounterType: IFirmwareCounterType
  ): Promise<IFetchFirmwareFileBlobResult> {
    // This operation needs CORS setting for the GCS bucket.
    // cors.json: [{"origin": ["*"], "method": ["GET"], "maxAgeSeconds": 3600}]
    // gsutil cors set cors.json gs://remap-b2d08.appspot.com
    const downloadUrl = await this.storage
      .ref(firmwareFilePath)
      .getDownloadURL();
    const response = await fetch(downloadUrl);
    if (response.ok) {
      const blob = await response.blob();

      if (firmwareCounterType === 'download') {
        await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .doc(definitionId)
          .update({
            total_firmware_download_count:
              firebase.firestore.FieldValue.increment(1),
          });
      } else if (firmwareCounterType === 'flash') {
        await this.db
          .collection('keyboards')
          .doc('v2')
          .collection('definitions')
          .doc(definitionId)
          .update({
            total_firmware_flash_count:
              firebase.firestore.FieldValue.increment(1),
          });
      } else {
        throw new Error(
          `Unknown firmware counter type: ${firmwareCounterType}`
        );
      }

      return successResultOf({
        blob,
      });
    } else {
      return errorResultOf(
        `Fetching firmware file failed. status=${response.status}`
      );
    }
  }

  async deleteFirmware(
    definitionId: string,
    firmware: IFirmware
  ): Promise<IEmptyResult> {
    const definitionDocument = await this.db
      .collection('keyboards')
      .doc('v2')
      .collection('definitions')
      .doc(definitionId)
      .get();
    if (definitionDocument.exists) {
      const newFirmwares = definitionDocument
        .data()!
        .firmwares.filter((x: any) => {
          return (
            x.created_at.toDate().getTime() !== firmware.created_at.getTime()
          );
        });
      await definitionDocument.ref.update({
        firmwares: newFirmwares,
      });
      const storageRef = this.storage.ref(firmware.filename);
      await storageRef.delete();
      return successResult();
    } else {
      return errorResultOf(
        `The keyboard definition[${definitionId}] not found`
      );
    }
  }

  async updateFirmware(
    definitionId: string,
    firmware: IFirmware,
    firmwareName: string,
    firmwareDescription: string,
    firmwareSourceCodeUrl: string,
    flashSupport: boolean,
    defaultBootloaderType: IBootloaderType
  ): Promise<IEmptyResult> {
    const definitionDocument = await this.db
      .collection('keyboards')
      .doc('v2')
      .collection('definitions')
      .doc(definitionId)
      .get();
    if (definitionDocument.exists) {
      const newFirmwares = definitionDocument
        .data()!
        .firmwares.map((x: any) => {
          if (
            x.created_at.toDate().getTime() === firmware.created_at.getTime()
          ) {
            x.name = firmwareName;
            x.description = firmwareDescription;
            x.source_code_url = firmwareSourceCodeUrl;
            x.flash_support = flashSupport;
            x.default_bootloader_type = defaultBootloaderType;
          }
          return x;
        });
      await definitionDocument.ref.update({
        firmwares: newFirmwares,
      });
      return successResult();
    } else {
      return errorResultOf(
        `The keyboard definition[${definitionId}] not found`
      );
    }
  }

  async uploadKeyboardCatalogMainImage(
    definitionId: string,
    file: File,
    // eslint-disable-next-line no-unused-vars
    progress: (uploadedRate: number) => void
  ): Promise<IEmptyResult> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IEmptyResult>((resolve, reject) => {
      const uploadTask = this.storage.ref(`/catalog/${definitionId}`).put(file);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const rate = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progress(rate);
        },
        (error) => {
          console.error(error);
          resolve(
            errorResultOf('Uploading keyboard catalog image failed.', error)
          );
        },
        async () => {
          const thumbnailImageUrl = await this.storage
            .ref(`/catalog/resized/${definitionId}_200x150`)
            .getDownloadURL();
          const imageUrl = await this.storage
            .ref(`/catalog/resized/${definitionId}_400x300`)
            .getDownloadURL();
          await this.db
            .collection('keyboards')
            .doc('v2')
            .collection('definitions')
            .doc(definitionId)
            .update({
              thumbnail_image_url: thumbnailImageUrl,
              image_url: imageUrl,
              updated_at: new Date(),
            });
          resolve(successResult());
        }
      );
    });
  }

  async uploadKeyboardCatalogSubImage(
    definitionId: string,
    file: File,
    // eslint-disable-next-line no-unused-vars
    progress: (uploadedRate: number) => void
  ): Promise<IEmptyResult> {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IEmptyResult>((resolve, reject) => {
      const timestamp = new Date().getTime();
      const uploadTask = this.storage
        .ref(`/catalog/${definitionId}_${timestamp}`)
        .put(file);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const rate = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progress(rate);
        },
        (error) => {
          console.error(error);
          resolve(
            errorResultOf('Uploading keyboard catalog image failed.', error)
          );
        },
        () => {
          setTimeout(async () => {
            const thumbnailImageUrl = await this.storage
              .ref(`/catalog/resized/${definitionId}_${timestamp}_200x150`)
              .getDownloadURL();
            const imageUrl = await this.storage
              .ref(`/catalog/resized/${definitionId}_${timestamp}_400x300`)
              .getDownloadURL();
            const documentSnapshot = await this.db
              .collection('keyboards')
              .doc('v2')
              .collection('definitions')
              .doc(definitionId)
              .get();
            if (documentSnapshot.exists) {
              const subImages = documentSnapshot.data()!.sub_images || [];
              subImages.push({
                thumbnail_image_url: thumbnailImageUrl,
                image_url: imageUrl,
              });
              await this.db
                .collection('keyboards')
                .doc('v2')
                .collection('definitions')
                .doc(definitionId)
                .update({
                  sub_images: subImages,
                  updated_at: new Date(),
                });
              resolve(successResult());
            } else {
              resolve(
                errorResultOf(
                  `The target keyboard definition document [${definitionId}} not found.`
                )
              );
            }
          }, 5000);
        }
      );
    });
  }

  async deleteKeyboardCatalogSubImage(
    definitionId: string,
    subImageIndex: number
  ): Promise<IEmptyResult> {
    const documentSnapshot = await this.db
      .collection('keyboards')
      .doc('v2')
      .collection('definitions')
      .doc(definitionId)
      .get();
    if (documentSnapshot.exists) {
      const subImages: ISubImage[] = documentSnapshot.data()!.sub_images || [];
      const newSubImages = subImages.filter(
        (subImage, index) => index !== subImageIndex
      );
      await this.db
        .collection('keyboards')
        .doc('v2')
        .collection('definitions')
        .doc(definitionId)
        .update({
          sub_images: newSubImages,
          updated_at: new Date(),
        });
      return successResult();
    } else {
      return errorResultOf(
        `The target keyboard definition document [${definitionId}} not found.`
      );
    }
  }

  async fetchOrganizationById(
    organizationId: string
  ): Promise<IFetchOrganizationByIdResult> {
    const documentSnapshot = await this.db
      .collection('organizations')
      .doc('v1')
      .collection('profiles')
      .doc(organizationId)
      .get();
    if (documentSnapshot.exists) {
      return successResultOf({
        organization: {
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        } as IOrganization,
      });
    } else {
      return errorResultOf(
        `The target organization document [${organizationId}] not found.`
      );
    }
  }

  async fetchOrganizationsByIds(
    organizationIds: string[]
  ): Promise<IFetchOrganizationsByIdsResult> {
    try {
      const organizationMap: Record<string, IOrganization> = {};
      for (const organizationId of organizationIds) {
        const documentSnapshot = await this.db
          .collection('organizations')
          .doc('v1')
          .collection('profiles')
          .doc(organizationId)
          .get();
        if (documentSnapshot.exists) {
          organizationMap[documentSnapshot.id] = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          } as IOrganization;
        } else {
          return errorResultOf(
            `The organization[${organizationId}}] not found`
          );
        }
      }
      return successResultOf({
        organizationMap,
      });
    } catch (error) {
      console.error(error);
      return errorResultOf('Fetching organizations failed', error);
    }
  }

  async fetchMyOrganizations(): Promise<IFetchMyOrganizationsResult> {
    try {
      const querySnapshot = await this.db
        .collection('organizations')
        .doc('v1')
        .collection('profiles')
        .where('members', 'array-contains', this.auth.currentUser!.uid)
        .get();
      return successResultOf({
        organizationMap: querySnapshot.docs.reduce((result, doc) => {
          result[doc.id] = {
            id: doc.id,
            ...doc.data(),
            created_at: doc.data()!.created_at.toDate(),
            updated_at: doc.data()!.updated_at.toDate(),
          } as IOrganization;
          return result;
        }, {} as Record<string, IOrganization>),
      });
    } catch (error) {
      console.error(error);
      return errorResultOf('Fetching my organizations failed', error);
    }
  }

  async fetchAllOrganizations(): Promise<IFetchAllOrganizationsResult> {
    try {
      const querySnapshot = await this.db
        .collection('organizations')
        .doc('v1')
        .collection('profiles')
        .get();
      return successResultOf({
        organizationMap: querySnapshot.docs.reduce((result, doc) => {
          result[doc.id] = {
            id: doc.id,
            ...doc.data(),
            created_at: doc.data()!.created_at.toDate(),
            updated_at: doc.data()!.updated_at.toDate(),
          } as IOrganization;
          return result;
        }, {} as Record<string, IOrganization>),
      });
    } catch (error) {
      console.error(error);
      return errorResultOf('Fetching all organizations failed', error);
    }
  }

  async fetchOrganizationMembers(
    organizationId: string
  ): Promise<IFetchOrganizationMembersResult> {
    try {
      const fetchOrganizationMembers = this.functions.httpsCallable(
        'fetchOrganizationMembers'
      );
      const fetchOrganizationMembersResult = await fetchOrganizationMembers({
        organizationId,
      });
      const data = fetchOrganizationMembersResult.data;
      if (data.success) {
        return successResultOf({
          members: data.members,
        });
      } else {
        console.error(data.errorMessage);
        return errorResultOf(data.errorMessage);
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Fetching Organization Members failed: ${error}`,
        error
      );
    }
  }

  async addOrganizationMember(
    organizationId: string,
    email: string
  ): Promise<IEmptyResult> {
    try {
      const addOrganizationMember = this.functions.httpsCallable(
        'addOrganizationMember'
      );
      const addOrganizationMemberResult = await addOrganizationMember({
        organizationId,
        email,
      });
      const data = addOrganizationMemberResult.data;
      if (data.success) {
        return successResult();
      } else {
        console.error(data.errorMessage);
        return errorResultOf(data.errorMessage);
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Adding Organization Member failed: ${error}`,
        error
      );
    }
  }

  async deleteOrganizationMember(
    organizationId: string,
    uid: string
  ): Promise<IEmptyResult> {
    try {
      const deleteOrganizationMember = this.functions.httpsCallable(
        'deleteOrganizationMember'
      );
      const deleteOrganizationMemberResult = await deleteOrganizationMember({
        organizationId,
        uid,
      });
      const data = deleteOrganizationMemberResult.data;
      if (data.success) {
        return successResult();
      } else {
        console.error(data.errorMessage);
        return errorResultOf(data.errorMessage);
      }
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Deleting Organization Member failed: ${error}`,
        error
      );
    }
  }

  async createAndFetchBuildableFirmware(
    keyboardDefinitionId: string
  ): Promise<IResult<IBuildableFirmware>> {
    try {
      const doc = await this.db
        .collection('build')
        .doc('v1')
        .collection('firmwares')
        .doc(keyboardDefinitionId)
        .get();
      if (doc.exists) {
        return successResultOf({
          keyboardDefinitionId: doc.data()!.keyboardDefinitionId,
          uid: doc.data()!.uid,
          enabled: doc.data()!.enabled,
          createdAt: doc.data()!.createdAt.toDate(),
          updatedAt: doc.data()!.updatedAt.toDate(),
        });
      }
      // Create a new buildable firmware document if not exists.
      const now = new Date();
      const buildableFirmware: IBuildableFirmware = {
        keyboardDefinitionId,
        uid: this.getCurrentAuthenticatedUser()!.uid,
        enabled: false,
        createdAt: now,
        updatedAt: now,
      };
      await this.db
        .collection('build')
        .doc('v1')
        .collection('firmwares')
        .doc(keyboardDefinitionId)
        .set(buildableFirmware);
      return successResultOf(buildableFirmware);
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Creating and fetching buildable firmware failed: ${error}`,
        error
      );
    }
  }

  async fetchBuildableFirmwareFiles(
    keyboardDefinitionId: string,
    fileType: IBuildableFirmwareFileType
  ): Promise<IResult<IBuildableFirmwareFile[]>> {
    try {
      const subCollectionName =
        fileType === 'keyboard' ? 'keyboardFiles' : 'keymapFiles';
      const querySnapshot = await this.db
        .collection('build')
        .doc('v1')
        .collection('firmwares')
        .doc(keyboardDefinitionId)
        .collection(subCollectionName)
        .get();
      const buildableFirmwareFiles: IBuildableFirmwareFile[] = [];
      querySnapshot.docs.forEach((doc) => {
        buildableFirmwareFiles.push({
          id: doc.id,
          path: doc.data()!.path,
          content: doc.data()!.content,
        });
      });
      return successResultOf(buildableFirmwareFiles);
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Fetching buildable firmware files failed: ${error}`,
        error
      );
    }
  }

  async createBuildableFirmwareFile(
    keyboardDefinitionId: string,
    fileType: IBuildableFirmwareFileType,
    fileName: string
  ): Promise<IEmptyResult> {
    try {
      const subCollectionName =
        fileType === 'keyboard' ? 'keyboardFiles' : 'keymapFiles';
      await this.db
        .collection('build')
        .doc('v1')
        .collection('firmwares')
        .doc(keyboardDefinitionId)
        .collection(subCollectionName)
        .add({
          path: fileName,
          content: '',
        });
      return successResult();
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Creating buildable firmware file failed: ${error}`,
        error
      );
    }
  }

  async updateBuildableFirmwareEnabled(
    keyboardDefinitionId: string,
    enabled: boolean
  ): Promise<IResult<IBuildableFirmware>> {
    try {
      const fetchBuildableFirmwareResult =
        await this.createAndFetchBuildableFirmware(keyboardDefinitionId);
      if (isError(fetchBuildableFirmwareResult)) {
        return errorResultOf(
          `Fetching buildable firmware failed: ${fetchBuildableFirmwareResult.error}`,
          fetchBuildableFirmwareResult.cause
        );
      }
      const buildableFirmware = fetchBuildableFirmwareResult.value;
      buildableFirmware.enabled = enabled;
      buildableFirmware.updatedAt = new Date();
      await this.db
        .collection('build')
        .doc('v1')
        .collection('firmwares')
        .doc(keyboardDefinitionId)
        .update(buildableFirmware);
      return successResultOf(buildableFirmware);
    } catch (error) {
      console.error(error);
      return errorResultOf(
        `Updating buildable firmware enabled failed: ${error}`,
        error
      );
    }
  }
}
