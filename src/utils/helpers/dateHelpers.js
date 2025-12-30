import { format, differenceInMinutes } from "date-fns";

export const toDateSafe = value => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDateTime = (date, fmt = "PPpp") => {
  const d = toDateSafe(date);
  if (!d) return "";
  try {
    return format(d, fmt);
  } catch {
    return "";
  }
};

export const calcDurationMinutes = (start, end) => {
  const s = toDateSafe(start);
  const e = toDateSafe(end);
  if (!s || !e) return 0;
  return differenceInMinutes(e, s);
};

export const today = () => new Date();
