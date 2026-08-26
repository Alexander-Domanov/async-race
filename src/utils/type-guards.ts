import type {Car} from "../types/types.ts";

export const isCar = (value: unknown): value is Car => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    return (
        "id" in value &&
        typeof value.id === "number" &&
        "name" in value &&
        typeof value.name === "string" &&
        "color" in value &&
        typeof value.color === "string"
    );
};

export const isCarArray = (value: unknown): value is Car[] => {
    return Array.isArray(value) && value.every(isCar);
};
