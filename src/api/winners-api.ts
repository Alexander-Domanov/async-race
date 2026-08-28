import {API_URL, HTTP_NOT_FOUND, WINNERS_LIMIT} from "../constants.ts";
import type {
    CreateWinnerPayload,
    Winner,
    WinnerPayload,
    WinnersResponse,
    WinnersSortField,
    WinnersSortOrder,
} from "../types/types.ts";
import {getTotalCount} from "../utils/api-helpers.ts";
import {isWinner, isWinnerArray} from "../utils/type-guards.ts";

export const getWinners = async (
    page: number,
    sortField: WinnersSortField,
    sortOrder: WinnersSortOrder,
): Promise<WinnersResponse> => {
    const url = new URL("/winners", API_URL);

    url.searchParams.set("_page", String(page));
    url.searchParams.set("_limit", String(WINNERS_LIMIT));
    url.searchParams.set("_sort", sortField);
    url.searchParams.set("_order", sortOrder);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Winners request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isWinnerArray(data)) {
        throw new Error("Invalid winners response format");
    }

    return {
        winners: data,
        totalCount: getTotalCount(response),
    };
};

export const getWinner = async (id: number): Promise<Winner | null> => {
    const url = new URL(`/winners/${id}`, API_URL);

    const response = await fetch(url);

    if (response.status === HTTP_NOT_FOUND) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Get winner request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isWinner(data)) {
        throw new Error("Invalid winner response format");
    }

    return data;
};

export const createWinner = async (payload: CreateWinnerPayload): Promise<Winner> => {
    const url = new URL("/winners", API_URL);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Create winner request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isWinner(data)) {
        throw new Error("Invalid create winner response format");
    }

    return data;
};

export const updateWinner = async (id: number, payload: WinnerPayload): Promise<Winner> => {
    const url = new URL(`/winners/${id}`, API_URL);

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Update winner request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isWinner(data)) {
        throw new Error("Invalid update winner response format");
    }

    return data;
};

export const deleteWinner = async (id: number): Promise<void> => {
    const url = new URL(`/winners/${id}`, API_URL);

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (!response.ok && response.status !== HTTP_NOT_FOUND) {
        throw new Error(`Delete winner request failed: ${response.status}`);
    }
};
