export const sanitizeString = value => value?.replace(/[<>]/g, "");
export const sanitizeObject = obj =>
  Object.fromEntries(
    Object.entries(obj || {}).map(([key, val]) => [key, typeof val === "string" ? sanitizeString(val) : val])
  );

export default { sanitizeString, sanitizeObject };
