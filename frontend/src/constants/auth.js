export const AUTH_ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
};

export const AUTH_STORAGE_KEYS = {
    ACCESS_TOKEN: "authToken",
    REFRESH_TOKEN: "refreshToken",
    USER_DATA: "userData",
};

export const AUTH_ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
};

export const PROTECTED_ROUTES = [
    "/books",
    "/donate",
    "/profile",
    "/library",
];

export const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
];
