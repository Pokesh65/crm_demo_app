// ── globalValidater ──────────────────────────────────────────
// Small, framework-agnostic validation helpers shared across
// forms in the app.

// Basic RFC-5322-ish email check — good enough for client-side
// UX validation (the real check happens via loginSchema/zod).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
    return EMAIL_REGEX.test(String(value || "").trim());
}

// Enables the submit button once every field in formData has a
// non-empty (post-trim) value. Doesn't check validity — schema
// validation handles that and surfaces inline errors instead.
function isButtonEnable(formData = {}) {
    return Object.values(formData).every(
        (value) => String(value ?? "").trim() !== ""
    );
}

export { isValidEmail, isButtonEnable };