import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./config";
import logger from "../logger/logger.service";

export const uploadToStorage = (file, path, onProgress) =>
  new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      error => {
        logger.error("StorageService", "UPLOAD_ERROR", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        logger.info("StorageService", "UPLOAD_SUCCESS", { path });
        resolve(downloadURL);
      }
    );
  });

export default { uploadToStorage };
