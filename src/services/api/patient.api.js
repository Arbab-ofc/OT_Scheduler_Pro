import { patientSchema } from "../../utils/validators/patientValidators";
import { addDocument, getDocument, queryDocuments, updateDocument } from "../firebase/firestore.service";
import logger from "../logger/logger.service";

export const createPatient = async data => {
  const parsed = patientSchema.parse({
    ...data,
    dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined
  });
  const patientId = `PAT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const docId = await addDocument("patients", {
    ...parsed,
    patientId,
    userId: data.userId || null
  });
  logger.info("PatientAPI", "CREATE_PATIENT", { patientId: docId });
  return docId;
};

export const getAllPatients = async (filters = []) => queryDocuments("patients", filters);

export const getPatientById = async id => getDocument("patients", id);

export const updatePatient = async (id, updates) => {
  patientSchema.partial().parse(updates);
  await updateDocument("patients", id, updates);
  logger.info("PatientAPI", "UPDATE_PATIENT", { patientId: id });
};

export default {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient
};
