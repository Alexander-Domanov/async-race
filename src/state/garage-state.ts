import {createCar, deleteCar, getCars, updateCar} from "../api/garage-api.ts";
import {driveEngine, startEngine, stopEngine} from "../api/engine-api.ts";
import {deleteWinner} from "../api/winners-api.ts";
import {GARAGE_LIMIT, GENERATE_COUNT} from "../constants.ts";
import type {Car, EngineCarState, EngineResponse, GarageState} from "../types/types.ts";
import {generateCarName, generateRandomColor} from "../utils/helpers.ts";

export const garageState: GarageState = {
    cars: [],
    currentPage: 1,
    totalCount: 0,
    createName: "",
    createColor: "#ffffff",
    selectedCarId: null,
    engineState: {},
    updateName: "",
    updateColor: "#ffffff",
};

export const loadGarage = async (): Promise<void> => {
    const result = await getCars(garageState.currentPage);

    garageState.cars = result.cars;
    garageState.totalCount = result.totalCount;
};

export const selectCar = (car: Car): void => {
    garageState.selectedCarId = car.id;
    garageState.updateName = car.name;
    garageState.updateColor = car.color;
};

export const applyCreateCar = async (name: string, color: string): Promise<void> => {
    if (name.length === 0) {
        return;
    }

    await createCar({name, color});

    garageState.currentPage = Math.max(1, Math.ceil((garageState.totalCount + 1) / GARAGE_LIMIT));

    await loadGarage();
};

export const applyUpdateCar = async (name: string, color: string): Promise<void> => {
    const selectedCarId = garageState.selectedCarId;

    if (selectedCarId === null || name.length === 0) {
        return;
    }

    await updateCar(selectedCarId, {name, color});

    await loadGarage();
};

export const applyDeleteCar = async (car: Car): Promise<void> => {
    await deleteCar(car.id);
    await deleteWinner(car.id);

    delete garageState.engineState[car.id];

    if (garageState.selectedCarId === car.id) {
        garageState.selectedCarId = null;
    }

    if (garageState.cars.length <= 1 && garageState.currentPage > 1) {
        garageState.currentPage -= 1;
    }

    await loadGarage();
};

export const applyGenerateCars = async (): Promise<void> => {
    const requests = Array.from({length: GENERATE_COUNT}, () => {
        return createCar({
            name: generateCarName(),
            color: generateRandomColor(),
        });
    });

    await Promise.all(requests);

    garageState.currentPage = Math.max(1, Math.ceil((garageState.totalCount + GENERATE_COUNT) / GARAGE_LIMIT));

    await loadGarage();
};

export const getEngineState = (carId: number): EngineCarState => {
    return garageState.engineState[carId] ?? "idle";
};

export const startCarEngine = async (carId: number): Promise<EngineResponse> => {
    const engine = await startEngine(carId);

    garageState.engineState[carId] = "driving";

    return engine;
};

export const stopCarEngine = async (carId: number): Promise<void> => {
    await stopEngine(carId);

    garageState.engineState[carId] = "idle";
};

export const driveCarEngine = async (carId: number): Promise<boolean> => {
    const result = await driveEngine(carId);

    if (result.status === "failed") {
        garageState.engineState[carId] = "broken";
        return false;
    }

    return true;
};

export const markEngineFinished = (carId: number): void => {
    garageState.engineState[carId] = "finished";
};
