import { createSlice } from "@reduxjs/toolkit";
import {
    getStoredData,
    saveStoredData,
} from "../../utils/utilityFunction";
import { CUSTOMER_KEY } from "../../utils/commonNames";
import { SEED_CUSTOMERS } from "../../utils/GlobalData";
import { successToster } from "../../utils/customToaster";

// ── Load + merge + dedupe + normalize initial customers ───────
const loadInitialCustomers = () => {
    const merged = [
        ...getStoredData(CUSTOMER_KEY),
        ...SEED_CUSTOMERS,
    ];

    const deduped = [
        ...new Map(
            merged.map((item) => [item.email, item])
        ).values(),
    ];

    const normalized = deduped.map((customer) => ({
        notes: [],
        activities: [],
        ...customer,
    }));

    saveStoredData(
        CUSTOMER_KEY,
        normalized
    );

    return normalized;
};

const initialState = {
    list: loadInitialCustomers(),
};

const customerSlice = createSlice({
    name: "customers",

    initialState,

    reducers: {
        // ── Add Customer ───────────────────────────────────────
        addCustomer: (state, action) => {

            const customer = action.payload;
            console.log("current customer ", customer)
            const updated = [...state.list, customer];

            state.list = updated

            saveStoredData(
                CUSTOMER_KEY,
                updated
            );

            successToster(
                "Customer Created",
                `Customer has been created successfully!`
            );
        },

        // ── Update Customer ────────────────────────────────────
        updateCustomer: (state, action) => {
            console.log("update payload", action.payload)

            const updated = state.list.map((customer) =>
                customer.id === action.payload.id
                    ? {
                        ...customer,
                        ...action.payload,
                    }
                    : customer
            );

            console.log("update payload updated", updated)

            state.list = updated;

            saveStoredData(
                CUSTOMER_KEY,
                updated
            );

            successToster(
                "Customer Updated",
                `Customer has been updated successfully!`
            );
        },

        // ── Delete Customer ────────────────────────────────────
        deleteCustomer: (state, action) => {
            const updated = state.list.filter(
                (customer) =>
                    customer.id !== action.payload
            );

            state.list = updated;

            saveStoredData(
                CUSTOMER_KEY,
                updated
            );

            successToster(
                "Customer Deleted",
                "Customer has been deleted successfully!"
            );
        },

        // ── Delete Multiple Customers ──────────────────────────
        deleteManyCustomers: (state, action) => {
            const idsToRemove = action.payload;

            const updated = state.list.filter(
                (customer) =>
                    !idsToRemove.includes(customer.id)
            );

            state.list = updated;

            saveStoredData(
                CUSTOMER_KEY,
                updated
            );

            successToster(
                "Customers Deleted",
                "Customers have been deleted successfully!"
            );
        },

        // ── Add Customer Note ──────────────────────────────────
        addCustomerNote: (state, action) => {
            const {
                customerId,
                note,
            } = action.payload;

            const updated = state.list.map(
                (customer) =>
                    customer.id === customerId
                        ? {
                            ...customer,
                            notes: [
                                note,
                                ...(customer.notes || []),
                            ],
                        }
                        : customer
            );

            state.list = updated;

            saveStoredData(
                CUSTOMER_KEY,
                updated
            );

            successToster(
                "Note Added",
                "Customer note has been added successfully!"
            );
        },

        // ── Add Customer Activity ──────────────────────────────
        addCustomerActivity: (state, action) => {
            const {
                customerId,
                activity,
            } = action.payload;

            const updated = state.list.map(
                (customer) =>
                    customer.id === customerId
                        ? {
                            ...customer,
                            activities: [
                                activity,
                                ...(customer.activities || []),
                            ],
                        }
                        : customer
            );

            state.list = updated;

            saveStoredData(
                CUSTOMER_KEY,
                updated
            );

            successToster(
                "Activity Added",
                "Customer activity has been added successfully!"
            );
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