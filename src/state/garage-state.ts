import {getCars} from "../api/garage-api.ts";
import type {GarageState} from "../types/types.ts";

export const garageState: GarageState = {
    cars: [],
    currentPage: 1,
    totalCount: 0,
    createName: "",
    createColor: "#ffffff",
    selectedCarId: null,
    updateName: "",
    updateColor: "#ffffff",
};

export const loadGarage = async (): Promise<void> => {
    const result = await getCars(garageState.currentPage);

    garageState.cars = result.cars;
    garageState.totalCount = result.totalCount;
};
