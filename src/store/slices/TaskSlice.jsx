import { createSlice } from "@reduxjs/toolkit";
import {
    getStoredData,
    saveStoredData,
} from "../../utils/utilityFunction";
import { TASK_KEY } from "../../utils/commonNames";
import { SEED_TASKS } from "../../utils/GlobalData";
import { successToster } from "../../utils/customToaster";

// ── Load + merge + dedupe + persist initial tasks ─────────────
const loadInitialTasks = () => {
    const merged = [
        ...getStoredData(TASK_KEY),
        ...SEED_TASKS,
    ];

    const deduped = [
        ...new Map(
            merged.map((item) => [item.id, item])
        ).values(),
    ];

    saveStoredData(TASK_KEY, deduped);

    return deduped;
};

const initialState = {
    list: loadInitialTasks(),
};

const taskSlice = createSlice({
    name: "tasks",

    initialState,

    reducers: {
        // ── Add Task ───────────────────────────────────────────
        addTask: (state, action) => {
            const updated = [
                action.payload,
                ...state.list,
            ];

            state.list = updated;

            saveStoredData(
                TASK_KEY,
                updated
            );

            successToster(
                "New Task",
                "New task has been created successfully!"
            );
        },

        // ── Update Task ────────────────────────────────────────
        updateTask: (state, action) => {
            const updated = state.list.map((task) =>
                task.id === action.payload.id
                    ? action.payload
                    : task
            );

            state.list = updated;

            saveStoredData(
                TASK_KEY,
                updated
            );

            successToster(
                "Task Updated",
                "Task has been updated successfully!"
            );
        },

        // ── Delete Task ────────────────────────────────────────
        deleteTask: (state, action) => {
            const updated = state.list.filter(
                (task) => task.id !== action.payload
            );

            state.list = updated;

            saveStoredData(
                TASK_KEY,
                updated
            );

            successToster(
                "Task Deleted",
                "Task has been deleted successfully!"
            );
        },

        // ── Delete Multiple Tasks ──────────────────────────────
        deleteManyTasks: (state, action) => {
            const idsToRemove = action.payload;

            const updated = state.list.filter(
                (task) =>
                    !idsToRemove.includes(task.id)
            );

            state.list = updated;

            saveStoredData(
                TASK_KEY,
                updated
            );

            successToster(
                "Tasks Deleted",
                "Tasks have been deleted successfully!"
            );
        },

        // ── Change Task Status ─────────────────────────────────
        changeTaskStatus: (state, action) => {
            const { id, status } = action.payload;

            const updated = state.list.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status,
                    }
                    : task
            );

            state.list = updated;

            saveStoredData(
                TASK_KEY,
                updated
            );

            successToster(
                "Task Status Changed",
                "Task status has been changed successfully!"
            );
        },
    },
});

export const {
    addTask,
    updateTask,
    deleteTask,
    deleteManyTasks,
    changeTaskStatus,
} = taskSlice.actions;

export default taskSlice.reducer;