

// ── Read / write the local "users table" ────────────────────────
export const getStoredData = (USERS_KEY) => {
    try {
        const stored = JSON.parse(localStorage.getItem(USERS_KEY));
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
};

export const saveStoredData = (USERS_KEY, users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};