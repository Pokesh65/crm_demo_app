import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice";
import customerReducer from './slices/CustomerSlice';
import leadReducer from './slices/LeadSlice';
import taskReducer from './slices/TaskSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        customers: customerReducer,
        leads: leadReducer,
        tasks: taskReducer,
    },
});

