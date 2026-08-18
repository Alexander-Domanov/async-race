export interface Car {
    id: number;
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
}

export type Page = 'garage' | 'winners';
