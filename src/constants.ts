const apiUrl: unknown = import.meta.env["VITE_API_URL"];

if (typeof apiUrl !== "string" || apiUrl.length === 0) {
    throw new Error("VITE_API_URL is not defined");
}

export const API_URL = apiUrl;

export const GARAGE_LIMIT = 7;

export const HTTP_NOT_FOUND = 404;

export const GENERATE_COUNT = 100;

export const CAR_BRANDS = [
    "Tesla",
    "Ford",
    "BMW",
    "Audi",
    "Toyota",
    "Mercedes-Benz",
    "Lada",
    "Porsche",
    "Honda",
    "Chevrolet",
];

export const CAR_MODELS = [
    "Model S",
    "Mustang",
    "X5",
    "A4",
    "Camry",
    "E-Class",
    "Vesta",
    "911",
    "Civic",
    "Corvette",
];
