import { createSlice } from "@reduxjs/toolkit";
import { getStoredData, saveStoredData } from "../../utils/utilityFunction";
import { LEAD_KEY } from "../../utils/commonNames";
import { SEED_LEADS } from "../../utils/GlobalData";
import { successToster } from "../../utils/customToaster";

// ── Step 2 of the template: load + merge + persist on first read ──
// This is the same dedup-by-email logic that used to live in
// LeadPage's mount useEffect. It's a data-loading concern, so it
// belongs here now — the component shouldn't know how leads get
// seeded or deduped, it should just ask the store for the list.
const loadInitialLeads = () => {
    const merged = [...getStoredData(LEAD_KEY), ...SEED_LEADS];
    const deduped = [...new Map(merged.map((item) => [item.email, item])).values()];
    saveStoredData(LEAD_KEY, deduped);
    return deduped;
};

const initialState = {
    list: loadInitialLeads(),
};

const leadSlice = createSlice({
    name: "leads",
    initialState,
    reducers: {
        // ── Step 3: every reducer computes a plain array, assigns
        // it to state.list, then persists that same plain array. ──

        addLead: (state, action) => {
            const updated = [action.payload, ...state.list];
            state.list = updated;
            saveStoredData(LEAD_KEY, updated);
            successToster("New Lead", "New lead has been created successfully!")
        },

        updateLead: (state, action) => {
            const updated = state.list.map((lead) =>
                lead.id === action.payload.id ? action.payload : lead
            );
            state.list = updated;
            saveStoredData(LEAD_KEY, updated);
            successToster("Lead Updated", "Lead has been updated successfully!")

        },

        deleteLead: (state, action) => {
            const updated = state.list.filter((lead) => lead.id !== action.payload);
            state.list = updated;
            saveStoredData(LEAD_KEY, updated);
            successToster("Lead Deleted", "Lead has been deleted successfully!")

        },

        deleteManyLeads: (state, action) => {
            const idsToRemove = action.payload;
            const updated = state.list.filter((lead) => !idsToRemove.includes(lead.id));
            state.list = updated;
            saveStoredData(LEAD_KEY, updated);
            successToster("Leads Deleted", "Leads has been deleted successfully!")

        },

        changeLeadStatus: (state, action) => {
            const { id, status } = action.payload;
            const updated = state.list.map((lead) =>
                lead.id === id ? { ...lead, status } : lead
            );
            state.list = updated;
            saveStoredData(LEAD_KEY, updated);
            successToster("Lead Status Changed", "Leads status has been changed successfully!")

        },
    },
});

export const {
    addLead,
    updateLead,
    deleteLead,
    deleteManyLeads,
    changeLeadStatus,
} = leadSlice.actions;

export default leadSlice.reducer;