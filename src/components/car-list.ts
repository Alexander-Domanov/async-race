import type {Car, EngineCarState} from "../types/types.ts";
import {createCarCard} from "./car-card.ts";

interface CarListProperties {
    cars: Car[];
    selectedCarId: number | null;
    engineState: Record<number, EngineCarState>;
    onSelect: (car: Car) => void;
    onRemove: (car: Car) => void;
    onStart: (car: Car, lane: HTMLElement, vehicle: HTMLElement) => void;
    onStop: (car: Car, vehicle: HTMLElement) => void;
}

export const createCarList = ({
    cars,
    selectedCarId,
    engineState,
    onSelect,
    onRemove,
    onStart,
    onStop,
}: CarListProperties): HTMLElement => {
    const list = document.createElement("div");

    list.classList.add(
        "garage-list",
        "flex",
        "flex-col",
        "gap-4",
    );

    for (const car of cars) {
        list.append(createCarCard({
            car,
            isSelected: selectedCarId === car.id,
            engineState: engineState[car.id] ?? "idle",
            onSelect,
            onRemove,
            onStart,
            onStop,
        }));
    }

    return list;
};
