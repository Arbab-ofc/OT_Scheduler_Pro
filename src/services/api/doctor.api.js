import { doctorSchema } from "../../utils/validators/doctorValidators";
import { addDocument, getDocument, queryDocuments, updateDocument } from "../firebase/firestore.service";
import { uploadFile } from "../cloudinary/upload.service";
import logger from "../logger/logger.service";

export const createDoctor = async doctorData => {
  const parsed = doctorSchema.parse(doctorData);
  let photoURL = parsed.photoURL || null;

  if (doctorData.photo && doctorData.photo instanceof File) {
    const uploadRes = await uploadFile(doctorData.photo, "doctors");
    photoURL = uploadRes.secure_url || null;
  }

  const docId = await addDocument(
    "doctors",
    {
      ...parsed,
      photoURL,
      doctorId: `DOC-${Date.now()}`
    }
  );
  logger.info("DoctorAPI", "CREATE_DOCTOR", { doctorId: docId });
  return docId;
};

export const getAllDoctors = async (filters = []) => queryDocuments("doctors", filters);

export const getDoctorById = async doctorId => getDocument("doctors", doctorId);

export const updateDoctor = async (doctorId, updates) => {
  doctorSchema.partial().parse(updates);
  await updateDocument("doctors", doctorId, updates);
  logger.info("DoctorAPI", "UPDATE_DOCTOR", { doctorId });
};

export default {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor
};
