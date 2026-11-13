// Attachment limits for /api/send-mail. Imported by the route (to enforce them)
// and by the Hero "Two Columns with Form" upload field (to validate early), so
// the two can't drift. Keep this file free of server-only imports.
export const MAX_FILES = 2;
export const MAX_TOTAL_SIZE_MB = 10;
export const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;
