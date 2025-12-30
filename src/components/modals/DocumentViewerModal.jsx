import { AnimatePresence, motion } from "framer-motion";

const DocumentViewerModal = ({ isOpen, onClose, document }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-surface-dark rounded-xl p-4 max-w-3xl w-full shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{document?.documentName || "Document"}</h3>
            <button onClick={onClose} className="text-sm">✕</button>
          </div>
          <div className="h-[60vh] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden">
            {document?.documentURL ? (
              <iframe title="document-viewer" src={document.documentURL} className="w-full h-full" />
            ) : (
              <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">No document provided.</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DocumentViewerModal;
