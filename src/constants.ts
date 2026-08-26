const apiUrl: unknown = import.meta.env["VITE_API_URL"];

if (typeof apiUrl !== "string" || apiUrl.length === 0) {
    throw new Error("VITE_API_URL is not defined");
}

export const API_URL = apiUrl;

export const GARAGE_LIMIT = 7;

export const HTTP_NOT_FOUND = 404;
