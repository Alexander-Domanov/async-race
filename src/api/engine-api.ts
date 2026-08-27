import {API_URL, HTTP_INTERNAL_SERVER_ERROR} from "../constants.ts";
import type {DriveResult, EngineResponse} from "../types/types.ts";
import {isDriveResponse, isEngineResponse} from "../utils/type-guards.ts";

type EngineStatus = "started" | "stopped" | "drive";

const createEngineUrl = (id: number, status: EngineStatus): URL => {
    const url = new URL("/engine", API_URL);

    url.searchParams.set("id", String(id));
    url.searchParams.set("status", status);

    return url;
};

const requestEngine = async (id: number, status: EngineStatus): Promise<EngineResponse> => {
    const response = await fetch(createEngineUrl(id, status), {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error(`Engine request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isEngineResponse(data)) {
        throw new Error("Invalid engine response format");
    }

    return data;
};

export const startEngine = (id: number): Promise<EngineResponse> => {
    return requestEngine(id, "started");
};

export const stopEngine = (id: number): Promise<EngineResponse> => {
    return requestEngine(id, "stopped");
};

export const driveEngine = async (id: number): Promise<DriveResult> => {
    const response = await fetch(createEngineUrl(id, "drive"), {
        method: "PATCH",
    });

    if (response.status === HTTP_INTERNAL_SERVER_ERROR) {
        return {status: "failed"};
    }

    if (!response.ok) {
        throw new Error(`Drive request failed: ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isDriveResponse(data)) {
        throw new Error("Invalid drive response format");
    }

    return {status: "success"};
};
