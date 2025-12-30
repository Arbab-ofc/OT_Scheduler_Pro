import { AnimatePresence, motion } from "framer-motion";
import { formatDateTime } from "../../utils/helpers/dateHelpers";

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const buildDocUrl = doc => {
  if (doc.documentURL) return doc.documentURL;
  if (doc.publicId && cloudName) {
    const resource = doc.resourceType || "raw";
    const format = doc.format ? `.${doc.format}` : "";
    return `https://res.cloudinary.com/${cloudName}/${resource}/upload/${doc.publicId}${format}`;
  }
  return "";
};

const ScheduleModal = ({
  isOpen,
  onClose,
  schedule,
  onUploadDocuments,
  uploadingDocuments,
  onDelete,
  deleting,
  onDeleteDocument,
  deletingDocumentId
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white dark:bg-surface-dark rounded-xl p-6 max-w-lg w-full shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold">{schedule?.surgeryType || "Schedule Details"}</h3>
            <button onClick={onClose} aria-label="Close" className="text-sm">✕</button>
          </div>
          <div className="space-y-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            <p><strong>Patient:</strong> {schedule?.patientName || schedule?.patientId || "—"}</p>
            <p><strong>Doctor:</strong> {schedule?.doctorName || schedule?.doctorId || "—"}</p>
            <p><strong>OT Room:</strong> {schedule?.otRoomNumber || "—"}</p>
            <p><strong>Status:</strong> {schedule?.status || "—"}</p>
            <p><strong>Time:</strong> {formatDateTime(schedule?.scheduledStartTime, "PPp") || "—"}{schedule?.scheduledEndTime ? ` - ${formatDateTime(schedule.scheduledEndTime, "p")}` : ""}</p>
            {Array.isArray(schedule?.documents) && schedule.documents.length > 0 && (
              <div className="space-y-2">
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">Documents</p>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {schedule.documents.map((doc, idx) => {
                    const url = buildDocUrl(doc);
                    const name = doc.documentName || "Document";
                    const lower = name.toLowerCase();
                    const isImage = lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp");
                    const isPDF = lower.endsWith(".pdf");
                    const pdfViewerUrl = isPDF ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}` : null;
                    return (
                      <div key={url || idx} className="rounded-lg border border-border-light/60 dark:border-border-dark/60 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold truncate">{name}</p>
                          {onDeleteDocument && (
                            <button
                              onClick={() => onDeleteDocument(url)}
                              className="text-xs text-red-600 underline"
                              disabled={deletingDocumentId === url}
                            >
                              {deletingDocumentId === url ? "Removing..." : "Delete"}
                            </button>
                          )}
                        </div>
                        {isImage && (
                          <img src={url} alt={name} className="w-full rounded-md border border-border-light/60 dark:border-border-dark/60" />
                        )}
                        {isPDF && (
                          <div className="space-y-2">
                            <iframe
                              title={name}
                              src={pdfViewerUrl || url}
                              className="w-full h-48 rounded-md border border-border-light/60 dark:border-border-dark/60"
                              allow="clipboard-write; encrypted-media"
                            />
                            <a href={url} target="_blank" rel="noreferrer" className="text-primary underline text-sm">
                              Open PDF
                            </a>
                          </div>
                        )}
                        {!isImage && !isPDF && (
                          <a href={url} className="text-primary underline text-sm" target="_blank" rel="noreferrer">
                            Open document
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {onUploadDocuments && (
              <div className="space-y-2 pt-3 border-t border-border-light/60 dark:border-border-dark/60 mt-3">
                <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">Add documents</p>
                <input
                  type="file"
                  multiple
                  onChange={e => {
                    const files = e.target.files;
                    if (files?.length) {
                      onUploadDocuments(files);
                      e.target.value = "";
                    }
                  }}
                />
                {uploadingDocuments && <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Uploading...</p>}
              </div>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-primary text-white">Close</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ScheduleModal;
