import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit as limitDocs,
  onSnapshot,
  orderBy as order,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "./config";
import logger from "../logger/logger.service";

const withTimestamps = data => ({
  ...data,
  updatedAt: new Date(),
  createdAt: data?.createdAt || new Date()
});

export const addDocument = async (collectionName, data, docId) => {
  const payload = withTimestamps(data);
  if (docId) {
    await setDoc(doc(db, collectionName, docId), payload);
    logger.info("FirestoreService", "ADD_DOCUMENT", { collectionName, docId });
    return docId;
  }
  const docRef = await addDoc(collection(db, collectionName), payload);
  logger.info("FirestoreService", "ADD_DOCUMENT", { collectionName, docId: docRef.id });
  return docRef.id;
};

export const getDocument = async (collectionName, docId) => {
  const snap = await getDoc(doc(db, collectionName, docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const updateDocument = async (collectionName, docId, updates) => {
  await updateDoc(doc(db, collectionName, docId), withTimestamps(updates));
  logger.info("FirestoreService", "UPDATE_DOCUMENT", { collectionName, docId });
};

export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
  logger.warn("FirestoreService", "DELETE_DOCUMENT", { collectionName, docId });
};

export const queryDocuments = async (collectionName, filters = [], orderBy = [], limitCount) => {
  const colRef = collection(db, collectionName);
  const clauses = [];
  filters.forEach(f => clauses.push(where(f.field, f.op || "==", f.value)));
  orderBy.forEach(o => clauses.push(order(o.field, o.direction || "asc")));
  if (limitCount) clauses.push(limitDocs(limitCount));
  const q = query(colRef, ...clauses);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const subscribeToDocument = (collectionName, docId, callback) =>
  onSnapshot(doc(db, collectionName, docId), snap => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null));

export const subscribeToCollection = (collectionName, filters = [], callback, onError) => {
  const clauses = filters.map(f => where(f.field, f.op || "==", f.value));
  const q = query(collection(db, collectionName), ...clauses);
  return onSnapshot(
    q,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    error => {
      logger.error("FirestoreService", "SUBSCRIBE_COLLECTION_ERROR", error);
      onError?.(error);
    }
  );
};

export default {
  addDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  subscribeToDocument,
  subscribeToCollection
};
