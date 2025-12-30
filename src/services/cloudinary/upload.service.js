const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const FOLDER = import.meta.env.VITE_CLOUDINARY_FOLDER;
const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

const validateFile = file => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type.");
  }
  if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
    throw new Error("File size exceeds 10MB limit.");
  }
};

const ensureConfig = () => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
  }
};

const resolveResourceType = file => (file?.type?.startsWith("image/") ? "image" : "raw");

export const uploadFile = (file, folder = "documents", onProgress) =>
  new Promise((resolve, reject) => {
    try {
      ensureConfig();
    } catch (err) {
      reject(err);
      return;
    }

    try {
      validateFile(file);
    } catch (error) {
      reject(error);
      return;
    }

    const resourceType = resolveResourceType(file);
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    if (FOLDER) {
      formData.append("folder", FOLDER);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress?.(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
        return;
      }
      try {
        const resp = JSON.parse(xhr.responseText || "{}");
        const code = resp?.error?.http_code || xhr.status;
        const message = resp?.error?.message;
        reject(new Error(message || (code === 401 ? "Cloudinary rejected the request (401). Check unsigned preset name." : "Cloudinary upload failed")));
      } catch {
        reject(new Error(xhr.status === 401 ? "Cloudinary rejected the request (401). Check unsigned preset name." : "Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });

export const uploadMultipleFiles = async (files, folder, onProgress) => {
  const results = [];
  let completed = 0;
  for (const file of files) {
    const res = await uploadFile(file, folder, progress => {
      const aggregate = ((completed + progress / 100) / files.length) * 100;
      onProgress?.(aggregate);
    });
    completed += 1;
    results.push(res);
  }
  onProgress?.(100);
  return results;
};

export default {
  uploadFile,
  uploadMultipleFiles
};
