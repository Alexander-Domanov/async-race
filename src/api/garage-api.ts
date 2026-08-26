import {API_URL, GARAGE_LIMIT} from "../constants.ts";
import type {Car, CarPayload, GarageResponse} from "../types/types.ts";
import {isCar, isCarArray} from "../utils/type-guards.ts";

const getTotalCount = (response: Response): number => {
    const header = response.headers.get("X-Total-Count");

    if (header === null) {
        throw new Error("Missing X-Total-Count");
    }

    const totalCount = Number(header);

    if (!Number.isInteger(totalCount) || totalCount < 0) {
        throw new Error("Invalid X-Total-Count");
    }

    return totalCount;
};

export const getCars = async (page: number): Promise<GarageResponse> => {
    const url = new URL("/garage", API_URL);

    url.searchParams.set("_page", String(page));
    url.searchParams.set("_limit", String(GARAGE_LIMIT));

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Garage request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isCarArray(data)) {
        throw new Error("Invalid garage response format");
    }

    return {
        cars: data,
        totalCount: getTotalCount(response),
    };
};

export const createCar = async (payload: CarPayload): Promise<Car> => {
    const url = new URL("/garage", API_URL);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Create car request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isCar(data)) {
        throw new Error("Invalid create car response format");
    }

    return data;
};

export const updateCar = async (id: number, payload: CarPayload): Promise<Car> => {
    const url = new URL(`/garage/${id}`, API_URL);

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Update car request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isCar(data)) {
        throw new Error("Invalid update car response format");
    }

    return data;
};

export const deleteCar = async (id: number): Promise<void> => {
    const url = new URL(`/garage/${id}`, API_URL);

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Delete car request failed: ${response.status}`);
    }
};
