export interface Car {
    id: number;
    name: string;
    color: string;
}

export interface CarPayload {
    name: string;
    color: string;
}

export interface GarageResponse {
    cars: Car[];
    totalCount: number;
}

export interface EngineResponse {
    velocity: number;
    distance: number;
}

export interface DriveResponse {
    success: boolean;
}

export type DriveResult =
    | {status: "success"}
    | {status: "failed"};

export type EngineCarState = "idle" | "driving" | "finished" | "broken";

export interface Winner {
    id: number;
    wins: number;
    time: number;
}

export interface CreateWinnerPayload {
    id: number;
    wins: number;
    time: number;
}

export interface WinnerPayload {
    wins: number;
    time: number;
}

export type WinnersSortField = "id" | "wins" | "time";

export type WinnersSortOrder = "ASC" | "DESC";

export interface WinnersResponse {
    winners: Winner[];
    totalCount: number;
}

export interface WinnersState {
    winners: Winner[];
    totalCount: number;
    currentPage: number;
    sortField: WinnersSortField;
    sortOrder: WinnersSortOrder;
}

export interface GarageState {
    cars: Car[];
    totalCount: number;
    currentPage: number;
    createName: string;
    createColor: string;
    selectedCarId: number | null;
    engineState: Record<number, EngineCarState>;
    updateName: string;
    updateColor: string;
}

export type Page = "garage" | "winners";
