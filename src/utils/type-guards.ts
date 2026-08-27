import type {Car, DriveResponse, EngineResponse} from "../types/types.ts";

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

export const isEngineResponse = (value: unknown): value is EngineResponse => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    return (
        "velocity" in value &&
        typeof value.velocity === "number" &&
        "distance" in value &&
        typeof value.distance === "number"
    );
};

export const isDriveResponse = (value: unknown): value is DriveResponse => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    return "success" in value && typeof value.success === "boolean";
};
