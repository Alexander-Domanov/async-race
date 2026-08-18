import {API_URL, GARAGE_LIMIT} from "../constants.ts";

import type {GarageResponse} from "../types/types.ts";

import {isCarArray} from "../utils/type-guards.ts";

const getTotalCount = (response: Response): number => {
    const header = response.headers.get("X-Total-Count");

    if (!header) {
        throw new Error("Missing X-Total-Count");
    }

    const totalCount = Number(header);

    if (!Number.isInteger(totalCount) || totalCount < 0) {
        throw new Error("Invalid X-Total-Count");
    }

    return totalCount;
}

export const getCars = async (page: number): Promise<GarageResponse> => {
    const url = new URL("/garage", API_URL);

    url.searchParams.set("_page", String(page));
    url.searchParams.set("_limit", String(GARAGE_LIMIT));

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error( `Garage request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isCarArray(data)) {
        throw new Error( "Invalid garage response format");
    }

    return {
        cars: data,
        totalCount: getTotalCount(response)
    }
}
