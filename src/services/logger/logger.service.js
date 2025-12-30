import log from "loglevel";
import { addDocument } from "../firebase/firestore.service";
import { auth } from "../firebase/config";

log.setLevel(process.env.NODE_ENV === "production" ? "info" : "debug");

const queue = [];
let flushTimer = null;

const enqueue = entry => {
  queue.push(entry);
  if (queue.length >= 10) {
    flush();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flush, 30000);
  }
};

export const flush = async () => {
  if (!queue.length) return;
  const batch = [...queue];
  queue.length = 0;
  clearTimeout(flushTimer);
  flushTimer = null;
  try {
    await Promise.all(
      batch.map(entry =>
        addDocument("activityLogs", {
          ...entry,
          timestamp: new Date()
        })
      )
    );
  } catch (error) {
    log.error("LoggerService", "FLUSH_ERROR", error);
  }
};

const formatEntry = (level, moduleName, action, details) => {
  const user = auth.currentUser;
  return {
    level,
    module: moduleName,
    action,
    details: details || {},
    userId: user?.uid || "anonymous",
    userEmail: user?.email || null
  };
};

const logger = {
  log(level, moduleName, action, details = {}) {
    const timestamp = new Date().toISOString();
    const entry = formatEntry(level.toUpperCase(), moduleName, action, details);
    log[level]?.(`[${timestamp}] [${level.toUpperCase()}] [${moduleName}] [${entry.userId}] [${action}]`, details);
    enqueue(entry);
  },
  info(moduleName, action, details) {
    this.log("info", moduleName, action, details);
  },
  warn(moduleName, action, details) {
    this.log("warn", moduleName, action, details);
  },
  error(moduleName, action, error) {
    this.log("error", moduleName, action, { message: error?.message || error });
  }
};

export default logger;
