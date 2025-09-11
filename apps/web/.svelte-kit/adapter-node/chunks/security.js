import { z } from "zod";
function sanitizeString(input, maxLen = 500) {
  if (typeof input !== "string") return "";
  const trimmed = input.trim().slice(0, maxLen);
  return trimmed.replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ");
}
function sanitizeRecord(obj) {
  const out = Array.isArray(obj) ? [] : {};
  for (const k in obj) {
    const v = obj[k];
    if (typeof v === "string") out[k] = sanitizeString(v);
    else if (v && typeof v === "object") out[k] = sanitizeRecord(v);
    else out[k] = v;
  }
  return out;
}
z.string().regex(/^Bearer\s+.+/);
export {
  sanitizeRecord as s
};
