export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const ENDPOINTS = {
    ALL_BOOKS: "/books",
    BORROW_BOOK: (id) => `/borrow/${id}`,
    DONATE_BOOK: "/books",
    USER_PROFILE: "/user/profile",
    USER_BORROWED_BOOKS: "/user/borrowed-books",
};

export const QUERY_KEYS = {
    BOOKS: "books",
    USER_PROFILE: "userProfile",
    BORROWED_BOOKS: "borrowedBooks",
};
