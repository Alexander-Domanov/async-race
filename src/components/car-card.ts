import type {Car} from "../types/types.ts";
import {createButton} from "./button.ts";
import {createCarImage} from "./car-image.ts";

const createManagementControls = (): HTMLDivElement => {
    const controls = document.createElement('div');

    controls.classList.add(
        'car-card__management',
        'flex',
        'items-center',
        'gap-2',
    );

    const selectButton = createButton({
        text: 'Select'
    });

    const removeButton = createButton({
        text: 'Remove'
    });


    selectButton.classList.add(
        'car-card__select',
    );

    removeButton.classList.add(
        'car-card__remove',
    );

    controls.append(selectButton, removeButton);

    return controls;
};

const createEngineControls = (): HTMLDivElement => {
    const engine = document.createElement('div');

    engine.classList.add(
        'car-card__engine-controls',
        'flex',
        'items-center',
        'gap-2',
    );

    const startButton = createButton({
        text: 'Start',
        disabled: true,
    });
    const stopButton = createButton({
        text: 'Stop',
        disabled: true,
    });

    startButton.classList.add(
        'car-card__start',
    );

    stopButton.classList.add(
        'car-card__stop',
    );

    engine.append(
        startButton, 
        stopButton
    );

    return engine
};

const createHeader = (name: string): HTMLElement => {
    const header = document.createElement('header');

    header.classList.add(
        'car-card__header',
        'flex',
        'items-center',
        'justify-between',
        'gap-4',
    );

    const managementControls = createManagementControls();

    const title = document.createElement('h3');

    title.classList.add(
        'car-card__title',
        'min-w-0',
        'break-words',
        'text-lg',
        'font-semibold',
        'text-slate-100',
    );

    title.textContent = name;

    header.append(managementControls, title);

    return header;
};

const createRaceLane = (
    color: string,
): HTMLDivElement => {
    const lane = document.createElement('div');

    lane.classList.add(
        'car-card__lane',
        'flex',
        'items-center',
        'justify-between',
    );

    const vehicle = document.createElement('div');

    vehicle.classList.add(
        'car-card__vehicle',
    );

    const image = createCarImage(color);

    vehicle.append(image);

    const finish = document.createElement('div');

    finish.classList.add(
        'car-card__finish',
    );

    finish.textContent = '🏁';

    lane.append(
        vehicle,
        finish,
    );

    return lane;
};

const createRaceRow = (
    color: string,
): HTMLDivElement => {
    const row = document.createElement('div');

    row.classList.add(
        'car-card__race-row',
        'flex',
        'flex-col',
        'gap-4',
    );

    const engineControls = createEngineControls();

    const lane = createRaceLane(color);

    row.append(
        engineControls,
        lane,
    );

    return row;
};

export const createCarCard = (
    car: Car,
): HTMLElement => {
    const card = document.createElement('article');

    card.classList.add(
        'car-card',
        'w-full',
        'rounded-xl',
        'border',
        'border-slate-700',
        'bg-slate-900',
        'p-4',
    );

    const header = createHeader(car.name);

    const raceRow = createRaceRow(car.color);

    card.append(
        header,
        raceRow,
    );

    return card;
};
