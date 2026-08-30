import type {Car, EngineCarState} from "../types/types.ts";
import {createButton} from "./button.ts";
import {createCarImage} from "./car-image.ts";

interface CarCardProperties {
    car: Car;
    isSelected: boolean;
    engineState: EngineCarState;
    onSelect: (car: Car) => void;
    onRemove: (car: Car) => void;
    onStart: (car: Car, lane: HTMLElement, vehicle: HTMLElement) => void;
    onStop: (car: Car, vehicle: HTMLElement) => void;
}

const createManagementControls = (
    car: Car,
    onSelect: (car: Car) => void,
    onRemove: (car: Car) => void,
): HTMLDivElement => {
    const controls = document.createElement("div");

    controls.classList.add(
        "car-card__management",
        "flex",
        "items-center",
        "gap-2",
    );

    const selectButton = createButton({text: "Select"});
    const removeButton = createButton({text: "Remove"});

    selectButton.classList.add("car-card__select");
    removeButton.classList.add("car-card__remove");

    selectButton.addEventListener("click", () => {
        onSelect(car);
    });

    removeButton.addEventListener("click", () => {
        onRemove(car);
    });

    controls.append(selectButton, removeButton);

    return controls;
};

const createStartButton = (engineState: EngineCarState): HTMLButtonElement => {
    const startButton = createButton({
        text: "Start",
        disabled: engineState !== "idle",
    });

    startButton.classList.add("car-card__start");

    return startButton;
};

const createStopButton = (engineState: EngineCarState): HTMLButtonElement => {
    const stopButton = createButton({
        text: "Stop",
        disabled: engineState === "idle",
    });

    stopButton.classList.add("car-card__stop");

    return stopButton;
};

const createEngineControls = (
    car: Car,
    engineState: EngineCarState,
    lane: HTMLElement,
    vehicle: HTMLElement,
    onStart: (car: Car, lane: HTMLElement, vehicle: HTMLElement) => void,
    onStop: (car: Car, vehicle: HTMLElement) => void,
): HTMLDivElement => {
    const engine = document.createElement("div");

    engine.classList.add(
        "car-card__engine-controls",
        "flex",
        "items-center",
        "gap-2",
    );

    const startButton = createStartButton(engineState);
    const stopButton = createStopButton(engineState);

    startButton.addEventListener("click", () => {
        startButton.disabled = true;
        stopButton.disabled = false;
        onStart(car, lane, vehicle);
    });

    stopButton.addEventListener("click", () => {
        stopButton.disabled = true;
        startButton.disabled = false;
        onStop(car, vehicle);
    });

    engine.append(startButton, stopButton);

    return engine;
};

const createHeader = (
    car: Car,
    onSelect: (car: Car) => void,
    onRemove: (car: Car) => void,
): HTMLElement => {
    const header = document.createElement("header");

    header.classList.add(
        "car-card__header",
        "flex",
        "items-center",
        "justify-between",
        "gap-4",
    );

    const managementControls = createManagementControls(car, onSelect, onRemove);

    const title = document.createElement("h3");

    title.classList.add(
        "car-card__title",
        "min-w-0",
        "break-words",
        "text-lg",
        "font-semibold",
        "text-slate-100",
    );

    title.textContent = car.name;

    header.append(managementControls, title);

    return header;
};

const createRaceLane = (color: string): {lane: HTMLDivElement; vehicle: HTMLDivElement} => {
    const lane = document.createElement("div");

    lane.classList.add(
        "car-card__lane",
        "flex",
        "items-center",
        "justify-between",
    );

    const vehicle = document.createElement("div");

    vehicle.classList.add("car-card__vehicle");

    const image = createCarImage(color);

    vehicle.append(image);

    const finish = document.createElement("div");

    finish.classList.add("car-card__finish");

    lane.append(vehicle, finish);

    return {lane, vehicle};
};

const createRaceRow = (
    car: Car,
    engineState: EngineCarState,
    onStart: (car: Car, lane: HTMLElement, vehicle: HTMLElement) => void,
    onStop: (car: Car, vehicle: HTMLElement) => void,
): HTMLDivElement => {
    const row = document.createElement("div");

    row.classList.add(
        "car-card__race-row",
        "flex",
        "flex-col",
        "gap-4",
    );

    const {lane, vehicle} = createRaceLane(car.color);
    const engineControls = createEngineControls(car, engineState, lane, vehicle, onStart, onStop);

    row.append(engineControls, lane);

    return row;
};

export const createCarCard = ({
    car,
    isSelected,
    engineState,
    onSelect,
    onRemove,
    onStart,
    onStop,
}: CarCardProperties): HTMLElement => {
    const card = document.createElement("article");

    card.classList.add(
        "car-card",
        "w-full",
        "rounded-xl",
        "border",
        "border-slate-700",
        "bg-slate-900",
        "p-4",
    );

    if (isSelected) {
        card.classList.add("car-card--selected");
    }

    const header = createHeader(car, onSelect, onRemove);
    const raceRow = createRaceRow(car, engineState, onStart, onStop);

    card.append(header, raceRow);

    return card;
};
