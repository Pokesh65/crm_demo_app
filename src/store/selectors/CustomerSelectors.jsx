// ── Reusable selectors for the customers slice ───────────────

export const selectAllCustomers = (state) => state.customers.list;

export const selectCustomerById = (id) => (state) =>
    state.customers.list.find((customer) => customer.id === id);

export const selectCustomersByStatus = (status) => (state) =>
    status === "All"
        ? state.customers.list
        : state.customers.list.filter((customer) => customer.status === status);

export const selectCustomerCount = (state) => state.customers.list.length;

