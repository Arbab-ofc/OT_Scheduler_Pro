import { useState } from "react";
import { uploadFile, uploadMultipleFiles } from "../services/cloudinary/upload.service";
import useLogger from "./useLogger";

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const log = useLogger("useCloudinary");

  const upload = async (file, folder) => {
    setUploading(true);
    try {
      const res = await uploadFile(file, folder, setProgress);
      log.info("UPLOAD_FILE", { name: file.name, folder });
      return res;
    } catch (error) {
      log.error("UPLOAD_FILE_ERROR", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMany = async (files, folder) => {
    setUploading(true);
    try {
      const res = await uploadMultipleFiles(files, folder, setProgress);
      log.info("UPLOAD_FILES", { count: files.length, folder });
      return res;
    } catch (error) {
      log.error("UPLOAD_FILES_ERROR", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploading, progress, upload, uploadMany };
};

export default useCloudinary;
