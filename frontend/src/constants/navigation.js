export const NAV_ITEMS = [
    { label: "Dashboard", path: "/", icon: "File" },
    { label: "Books", path: "/books", icon: "BookOpen" },
    { label: "My Books", path: "/my-books", icon: "BookMarked" },
    { label: "Donate", path: "/donate", icon: "BookCopy" },
];

export const ADMIN_NAV_ITEMS = [
    { label: "Admin Dashboard", path: "/admin", icon: "Shield" },
    { label: "Manage Requests", path: "/admin/requests", icon: "CheckSquare" },
];

// Remove hardcoded user ID - will be obtained from auth context
