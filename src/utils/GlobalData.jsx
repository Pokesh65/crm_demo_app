// export const SEED_CUSTOMERS = [
//     {
//         id: crypto.randomUUID(),
//         name: "Ava Thompson",
//         email: "ava.thompson@brightly.io",
//         phone: "+1 555-0142",
//         company: "Brightly Inc.",
//         location: "Austin, TX",
//         status: "Active",
//         assignedEmployee: "Sam Reed",
//         createdDate: new Date(Date.now() - 12 * 86400000).toISOString(),
//     },
//     {
//         id: crypto.randomUUID(),
//         name: "Noah Patel",
//         email: "noah.patel@vertexlabs.com",
//         phone: "+1 555-0198",
//         company: "Vertex Labs",
//         location: "Seattle, WA",
//         status: "Pending",
//         assignedEmployee: "Jamie Lee",
//         createdDate: new Date(Date.now() - 4 * 86400000).toISOString(),
//     },
//     {
//         id: crypto.randomUUID(),
//         name: "Mia Chen",
//         email: "mia.chen@nordapp.co",
//         phone: "+1 555-0176",
//         company: "NordApp",
//         location: "Denver, CO",
//         status: "Inactive",
//         assignedEmployee: "Sam Reed",
//         createdDate: new Date(Date.now() - 30 * 86400000).toISOString(),
//     },
// ];

// ── Add these alongside your existing SEED_CUSTOMERS, etc. ──────

export const LEAD_STATUSES = [
    "New",
    "Contacted",
    "Follow-up",
    "Qualified",
    "Converted",
    "Lost",
];

// export const SEED_LEADS = [
//     {
//         id: "lead-seed-1",
//         name: "Ethan Brooks",
//         email: "ethan.brooks@lumen.io",
//         phone: "+1 555-0111",
//         company: "Lumen Analytics",
//         status: "New",
//         assignedEmployee: "Jamie Lee",
//         createdDate: new Date(Date.now() - 2 * 86400000).toISOString(),
//     },
//     {
//         id: "lead-seed-2",
//         name: "Sofia Ramirez",
//         email: "sofia.ramirez@fluxworks.com",
//         phone: "+1 555-0134",
//         company: "FluxWorks",
//         status: "Qualified",
//         assignedEmployee: "Sam Reed",
//         createdDate: new Date(Date.now() - 6 * 86400000).toISOString(),
//     },
//     {
//         id: "lead-seed-3",
//         name: "Liam Carter",
//         email: "liam.carter@haloedge.com",
//         phone: "+1 555-0157",
//         company: "HaloEdge",
//         status: "Follow-up",
//         assignedEmployee: "Jamie Lee",
//         createdDate: new Date(Date.now() - 9 * 86400000).toISOString(),
//     },
// ];


;


// ── Add to utils/GlobalData.js ───────────────────────────────
export const TASK_STATUSES = ["Todo", "In Progress", "Completed"];
export const TASK_PRIORITIES = ["Low", "Medium", "High"];

// export const SEED_TASKS = [
//     {
//         id: "task-seed-1",
//         title: "Follow up with Vertex Labs",
//         description: "Send pricing sheet and schedule a demo call.",
//         assignedEmployee: "Jamie Lee",
//         priority: "High",
//         dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
//         status: "Todo",
//         createdDate: new Date(Date.now() - 1 * 86400000).toISOString(),
//     },
//     {
//         id: "task-seed-2",
//         title: "Prepare onboarding docs for Brightly Inc.",
//         description: "Draft welcome packet and account setup checklist.",
//         assignedEmployee: "Sam Reed",
//         priority: "Medium",
//         dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
//         status: "In Progress",
//         createdDate: new Date(Date.now() - 3 * 86400000).toISOString(),
//     },
//     {
//         id: "task-seed-3",
//         title: "Quarterly report review",
//         description: "Review Q3 numbers before the leadership sync.",
//         assignedEmployee: "Sam Reed",
//         priority: "Low",
//         dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
//         status: "Completed",
//         createdDate: new Date(Date.now() - 8 * 86400000).toISOString(),
//     },
// ];


export const SEED_CUSTOMERS = []
export const SEED_TASKS = []
export const SEED_LEADS = []