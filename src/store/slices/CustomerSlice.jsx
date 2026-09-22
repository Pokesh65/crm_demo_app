
import { createSlice } from "@reduxjs/toolkit";
import { getStoredData, saveStoredData } from "../../utils/utilityFunction";
import { CUSTOMER_KEY } from "../../utils/commonNames";
import { SEED_CUSTOMERS } from "../../utils/GlobalData";
import { successToster } from "../../utils/customToaster";

// Same template as leadSlice/taskSlice: merge stored + seed,
// dedupe by email, persist, return. Also backfills notes/activities
// arrays so older customer records (seeded before this feature
// existed) don't break when the detail page reads them.
const loadInitialCustomers = () => {
    const merged = [...getStoredData(CUSTOMER_KEY), ...SEED_CUSTOMERS];
    const deduped = [...new Map(merged.map((item) => [item.email, item])).values()];
    const normalized = deduped.map((customer) => ({
        notes: [],
        activities: [],
        ...customer,
    }));
    saveStoredData(CUSTOMER_KEY, normalized);
    return normalized;
};

const initialState = {
    list: loadInitialCustomers(),
};

const customerSlice = createSlice({
    name: "customers",
    initialState,
    reducers: {
        addCustomer: (state, action) => {
            const updated = [
                { notes: [], activities: [], ...action.payload },
                ...state.list,
            ];
            state.list = updated;
            saveStoredData(CUSTOMER_KEY, updated);
            successToster("Customer Created", `${action.payload.name} customer have been created successfully!`)
        },

        updateCustomer: (state, action) => {
            const updated = state.list.map((customer) =>
                customer.id === action.payload.id
                    ? { ...customer, ...action.payload }
                    : customer
            );
            state.list = updated;
            saveStoredData(CUSTOMER_KEY, updated);
        },

        deleteCustomer: (state, action) => {
            const updated = state.list.filter((customer) => customer.id !== action.payload);
            state.list = updated;
            saveStoredData(CUSTOMER_KEY, updated);
        },

        deleteManyCustomers: (state, action) => {
            const idsToRemove = action.payload;
            const updated = state.list.filter((customer) => !idsToRemove.includes(customer.id));
            state.list = updated;
            saveStoredData(CUSTOMER_KEY, updated);
        },

        // ── Customer Details additions ──────────────────────────

        // payload: { customerId, note: { id, text, author, createdDate } }
        addCustomerNote: (state, action) => {
            const { customerId, note } = action.payload;
            const updated = state.list.map((customer) =>
                customer.id === customerId
                    ? { ...customer, notes: [note, ...(customer.notes || [])] }
                    : customer
            );
            state.list = updated;
            saveStoredData(CUSTOMER_KEY, updated);
        },

        // payload: { customerId, activity: { id, type, description, createdDate } }
        addCustomerActivity: (state, action) => {
            const { customerId, activity } = action.payload;
            const updated = state.list.map((customer) =>
                customer.id === customerId
                    ? { ...customer, activities: [activity, ...(customer.activities || [])] }
                    : customer
            );
            state.list = updated;
            saveStoredData(CUSTOMER_KEY, updated);
        },
    },
});

export const {
    addCustomer,
    updateCustomer,
    deleteCustomer,
    deleteManyCustomers,
    addCustomerNote,
    addCustomerActivity,
} = customerSlice.actions;

export default customerSlice.reducer;