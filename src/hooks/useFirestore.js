import { useCallback } from "react";
import {
  addDocument,
  deleteDocument,
  getDocument,
  queryDocuments,
  subscribeToCollection,
  subscribeToDocument,
  updateDocument
} from "../services/firebase/firestore.service";

export const useFirestore = () => {
  const add = useCallback((collection, data) => addDocument(collection, data), []);
  const get = useCallback((collection, id) => getDocument(collection, id), []);
  const update = useCallback((collection, id, updates) => updateDocument(collection, id, updates), []);
  const remove = useCallback((collection, id) => deleteDocument(collection, id), []);
  const query = useCallback((collection, filters, orderBy, limit) => queryDocuments(collection, filters, orderBy, limit), []);
  const subscribeDoc = useCallback((collection, id, cb) => subscribeToDocument(collection, id, cb), []);
  const subscribeCol = useCallback((collection, filters, cb, onError) => subscribeToCollection(collection, filters, cb, onError), []);

  return { add, get, update, remove, query, subscribeDoc, subscribeCol };
};

export default useFirestore;
