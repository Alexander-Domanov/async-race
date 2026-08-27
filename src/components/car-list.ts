import type {Car} from "../types/types.ts";
import {createCarCard} from "./car-card.ts";

interface CarListProperties {
    cars: Car[];
    selectedCarId: number | null;
    onSelect: (car: Car) => void;
    onRemove: (car: Car) => void;
}

export const createCarList = ({
    cars,
    selectedCarId,
    onSelect,
    onRemove,
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
            onSelect,
            onRemove,
        }));
    }

    return list;
};
