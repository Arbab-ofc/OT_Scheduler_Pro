import { FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title = "Confirm action", message, confirmText = "Confirm", cancelText = "Cancel" }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-surface-dark rounded-xl p-6 max-w-md w-full shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertTriangle className="text-warning" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark" onClick={onClose}>
              {cancelText}
            </button>
            <button className="px-4 py-2 rounded-lg bg-error text-white" onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;
