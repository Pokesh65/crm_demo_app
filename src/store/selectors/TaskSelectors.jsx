// ── Reusable selectors for the tasks slice ───────────────────

export const selectAllTasks = (state) => state.tasks.list;

export const selectTaskById = (id) => (state) =>
    state.tasks.list.find((task) => task.id === id);

export const selectTasksByStatus = (status) => (state) =>
    status === "All"
        ? state.tasks.list
        : state.tasks.list.filter((task) => task.status === status);

// Used by CustomerDetailPage to show only the tasks linked to
// that specific customer (via task.customerId).
export const selectTasksByCustomerId = (customerId) => (state) =>
    state.tasks.list.filter((task) => task.customerId === customerId);

export const selectPendingTaskCount = (state) =>
    state.tasks.list.filter((task) => task.status !== "Completed").length;

export const selectCompletedTaskCount = (state) =>
    state.tasks.list.filter((task) => task.status === "Completed").length;

