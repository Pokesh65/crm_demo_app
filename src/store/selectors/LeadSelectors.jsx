// ── Reusable selectors for the leads slice ───────────────────
// Keep these here instead of writing `state.leads.list` inline
// in every component — if the shape of leadSlice's state ever
// changes, only this file needs to update.

export const selectAllLeads = (state) => state.leads.list;

export const selectLeadById = (id) => (state) =>
    state.leads.list.find((lead) => lead.id === id);

export const selectLeadsByStatus = (status) => (state) =>
    status === "All"
        ? state.leads.list
        : state.leads.list.filter((lead) => lead.status === status);

export const selectLeadCount = (state) => state.leads.list.length;

export const selectConvertedLeadCount = (state) =>
    state.leads.list.filter((lead) => lead.status === "Converted").length;

