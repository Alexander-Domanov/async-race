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

export interface GarageState {
    cars: Car[],
    totalCount: number;
    currentPage: number;
    createName: string;
    createColor: string;
}

export type Page = 'garage' | 'winners';
