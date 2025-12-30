import { scheduleSchema } from "../../utils/validators/scheduleValidators";
import { addDocument, getDocument, queryDocuments, updateDocument } from "../firebase/firestore.service";
import { uploadMultipleFiles } from "../cloudinary/upload.service";
import logger from "../logger/logger.service";
import { detectScheduleConflicts } from "../../hooks/useScheduleConflict";

const pruneUndefined = obj =>
  Object.fromEntries(Object.entries(obj || {}).filter(([, value]) => value !== undefined));

const sanitizeDocuments = docs =>
  Array.isArray(docs) ? docs.map(doc => pruneUndefined(doc)) : undefined;

export const createSchedule = async data => {
  const start = new Date(data.scheduledStartTime);
  const fallbackEnd = new Date(start.getTime() + 60 * 60 * 1000);
  const parsed = scheduleSchema.parse({
    ...data,
    surgeryDate: new Date(data.surgeryDate),
    scheduledStartTime: start,
    scheduledEndTime: data.scheduledEndTime ? new Date(data.scheduledEndTime) : fallbackEnd
  });
  const scheduleId = `SCH-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  let documents = parsed.documents || [];
  if (data.documents?.length) {
    const uploads = await uploadMultipleFiles(data.documents, "schedules");
    documents = uploads.map(f =>
      pruneUndefined({
        documentName: f.original_filename,
        documentURL: f.secure_url,
        publicId: f.public_id,
        resourceType: f.resource_type,
        format: f.format,
        uploadedAt: new Date()
      })
    );
  }
  const docId = await addDocument("schedules", {
    ...parsed,
    patientName: data.patientName || parsed.patientName || null,
    doctorName: data.doctorName || parsed.doctorName || null,
    documents: sanitizeDocuments(documents),
    scheduleId
  });
  logger.info("ScheduleAPI", "CREATE_SCHEDULE", { scheduleId: docId });
  return docId;
};

export const updateSchedule = async (id, updates) => {
  const clean = pruneUndefined({
    ...updates,
    documents: sanitizeDocuments(updates?.documents)
  });
  scheduleSchema.partial().parse(clean);
  await updateDocument("schedules", id, clean);
  logger.info("ScheduleAPI", "UPDATE_SCHEDULE", { scheduleId: id });
};

export const getScheduleById = async id => getDocument("schedules", id);

export const getAllSchedules = async (filters = [], orderBy = [{ field: "surgeryDate", direction: "asc" }]) =>
  queryDocuments("schedules", filters, orderBy);

export const updateScheduleStatus = async (id, newStatus, extra = {}) => {
  const updates = { status: newStatus, ...extra };
  if (newStatus === "completed" && !extra.scheduledEndTime) {
    updates.scheduledEndTime = new Date();
  }
  const clean = pruneUndefined(updates);
  scheduleSchema.partial().parse(clean);
  await updateDocument("schedules", id, clean);
  logger.info("ScheduleAPI", "STATUS_CHANGE", { scheduleId: id, status: newStatus });
};

export const checkOTAvailability = async (otRoomNumber, date, start, end) => {
  const sameDay = await queryDocuments("schedules", [
    { field: "otRoomNumber", value: otRoomNumber },
    { field: "surgeryDate", value: date }
  ]);
  const conflicts = detectScheduleConflicts({ schedules: sameDay, otRoomNumber, start, end });
  return { available: conflicts.length === 0, conflicts };
};

export default {
  createSchedule,
  updateSchedule,
  getScheduleById,
  getAllSchedules,
  updateScheduleStatus,
  checkOTAvailability
};
