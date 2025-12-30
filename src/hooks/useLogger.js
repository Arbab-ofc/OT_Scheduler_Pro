import logger from "../services/logger/logger.service";
import { useAuth } from "./useAuth";

export const useLogger = moduleName => {
  const { user } = useAuth();

  const withContext = (action, details, level = "info") => {
    const payload = { ...details, uid: user?.uid || "anon", email: user?.email };
    logger[level](moduleName, action, payload);
  };

  return {
    info: (action, details = {}) => withContext(action, details, "info"),
    warn: (action, details = {}) => withContext(action, details, "warn"),
    error: (action, error) => withContext(action, { error: error?.message || error }, "error")
  };
};

export default useLogger;
