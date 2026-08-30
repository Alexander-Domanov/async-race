import {createButton} from "../components/button.ts";
import {createCarForm} from "../components/car-form.ts";
import {createCarList} from "../components/car-list.ts";
import {createPagination} from "../components/pagination.ts";
import {GARAGE_LIMIT, MILLISECONDS_PER_SECOND} from "../constants.ts";
import {
    applyCreateCar,
    applyDeleteCar,
    applyGenerateCars,
    applyUpdateCar,
    driveCarEngine,
    garageState,
    getEngineState,
    loadGarage,
    markEngineFinished,
    selectCar,
    startCarEngine,
    stopCarEngine,
} from "../state/garage-state.ts";
import {saveWinner} from "../state/winners-state.ts";
import type {Car, EngineCarState} from "../types/types.ts";
import {animateCar} from "../utils/animation.ts";

const runningAnimations = new Map<number, () => void>();

interface RaceParticipant {
    car: Car;
    lane: HTMLElement;
    vehicle: HTMLElement;
}

interface GarageRenderProperties {
    engineState: Record<number, EngineCarState>;
    onCreate: (name: string, color: string) => void;
    onGenerate: () => void;
    onPageChange: (page: number) => void;
    onSelect: (car: Car) => void;
    onRemove: (car: Car) => void;
    onUpdate: (name: string, color: string) => void;
    onStart: (car: Car, lane: HTMLElement, vehicle: HTMLElement) => void;
    onStop: (car: Car, vehicle: HTMLElement) => void;
    onRaceStart: (message: HTMLElement) => void;
    onResetRace: (message: HTMLElement) => void;
}

const createCreateForm = (onCreate: (name: string, color: string) => void): HTMLFormElement => {
    return createCarForm({
        nameValue: garageState.createName,
        colorValue: garageState.createColor,
        submitText: "Create",
        onNameChange: (name) => {
            garageState.createName = name;
        },
        onColorChange: (color) => {
            garageState.createColor = color;
        },
        onSubmit: () => {
            onCreate(garageState.createName.trim(), garageState.createColor);
        },
    });
};

const createUpdateForm = (onUpdate: (name: string, color: string) => void): HTMLFormElement => {
    return createCarForm({
        nameValue: garageState.updateName,
        colorValue: garageState.updateColor,
        submitText: "Update",
        submitDisabled: garageState.selectedCarId === null,
        onNameChange: (name) => {
            garageState.updateName = name;
        },
        onColorChange: (color) => {
            garageState.updateColor = color;
        },
        onSubmit: () => {
            onUpdate(garageState.updateName.trim(), garageState.updateColor);
        },
    });
};

const createGenerateButton = (onGenerate: () => void): HTMLButtonElement => {
    const generateButton = createButton({text: "Generate Cars"});

    generateButton.addEventListener("click", () => {
        generateButton.disabled = true;
        onGenerate();
    });

    return generateButton;
};

const createGarageInfo = (): HTMLElement => {
    const info = document.createElement("p");

    info.classList.add("text-slate-400");
    info.textContent = `Page ${garageState.currentPage}, Total Cars: ${garageState.totalCount}`;

    return info;
};

const createRaceStartButton = (disabled: boolean): HTMLButtonElement => {
    const startRaceButton = createButton({
        text: "Start Race",
        disabled,
    });

    startRaceButton.classList.add("race-controls__start");

    return startRaceButton;
};

const createRaceResetButton = (disabled: boolean): HTMLButtonElement => {
    const resetRaceButton = createButton({
        text: "Reset Race",
        disabled,
    });

    resetRaceButton.classList.add("race-controls__reset");

    return resetRaceButton;
};

const createRaceMessage = (): HTMLParagraphElement => {
    const message = document.createElement("p");

    message.classList.add("race-controls__message", "text-slate-300");

    return message;
};

const createRaceControls = (
    startDisabled: boolean,
    resetDisabled: boolean,
    onRaceStart: (message: HTMLElement) => void,
    onResetRace: (message: HTMLElement) => void,
): HTMLDivElement => {
    const controls = document.createElement("div");

    controls.classList.add(
        "race-controls",
        "flex",
        "items-center",
        "gap-2",
        "flex-wrap",
    );

    const startRaceButton = createRaceStartButton(startDisabled);
    const resetRaceButton = createRaceResetButton(resetDisabled);
    const message = createRaceMessage();

    startRaceButton.addEventListener("click", () => {
        startRaceButton.disabled = true;
        resetRaceButton.disabled = false;
        onRaceStart(message);
    });

    resetRaceButton.addEventListener("click", () => {
        startRaceButton.disabled = false;
        resetRaceButton.disabled = true;
        onResetRace(message);
    });

    controls.append(startRaceButton, resetRaceButton, message);

    return controls;
};

const createGarageHeading = (): HTMLElement => {
    const heading = document.createElement("h2");

    heading.textContent = "Garage Page";

    return heading;
};

const createGarageCarList = (
    engineState: Record<number, EngineCarState>,
    onSelect: (car: Car) => void,
    onRemove: (car: Car) => void,
    onStart: (car: Car, lane: HTMLElement, vehicle: HTMLElement) => void,
    onStop: (car: Car, vehicle: HTMLElement) => void,
): HTMLElement => {
    return createCarList({
        cars: garageState.cars,
        selectedCarId: garageState.selectedCarId,
        engineState,
        onSelect,
        onRemove,
        onStart,
        onStop,
    });
};

const createGaragePagination = (onPageChange: (page: number) => void): HTMLElement => {
    const totalPages = Math.max(1, Math.ceil(garageState.totalCount / GARAGE_LIMIT));

    return createPagination({
        currentPage: garageState.currentPage,
        totalPages,
        onPageChange,
    });
};

const createRaceControlsWithState = (
    onRaceStart: (message: HTMLElement) => void,
    onResetRace: (message: HTMLElement) => void,
): HTMLDivElement => {
    const hasRunningCar = garageState.cars.some((car) => getEngineState(car.id) !== "idle");
    const startRaceDisabled = garageState.cars.length === 0 || hasRunningCar;
    const resetRaceDisabled = !hasRunningCar;

    return createRaceControls(startRaceDisabled, resetRaceDisabled, onRaceStart, onResetRace);
};

const renderGarage = ({
    engineState,
    onCreate,
    onGenerate,
    onPageChange,
    onSelect,
    onRemove,
    onUpdate,
    onStart,
    onStop,
    onRaceStart,
    onResetRace,
}: GarageRenderProperties): HTMLElement => {
    const container = document.createElement("div");

    container.append(
        createGarageHeading(),
        createGarageInfo(),
        createCreateForm(onCreate),
        createUpdateForm(onUpdate),
        createGenerateButton(onGenerate),
        createRaceControlsWithState(onRaceStart, onResetRace),
        createGarageCarList(engineState, onSelect, onRemove, onStart, onStop),
        createGaragePagination(onPageChange),
    );

    return container;
};

const showError = (page: HTMLElement, error: unknown): void => {
    page.textContent = error instanceof Error
        ? error.message
        : "Unknown error";
};

const runAction = async (page: HTMLElement, action: () => Promise<void>): Promise<void> => {
    try {
        await action();
        renderGaragePage(page);
    } catch (error: unknown) {
        showError(page, error);
    }
};

const runEngine = async (
    car: Car,
    lane: HTMLElement,
    vehicle: HTMLElement,
    onFinish?: (car: Car, durationMs: number) => void,
): Promise<void> => {
    const engine = await startCarEngine(car.id);
    const durationMs = engine.distance / engine.velocity;
    const cancelAnimation = animateCar(lane, vehicle, durationMs, () => {
        runningAnimations.delete(car.id);
        markEngineFinished(car.id);
        onFinish?.(car, durationMs);
    });

    runningAnimations.set(car.id, cancelAnimation);

    const isDriving = await driveCarEngine(car.id);

    if (!isDriving) {
        cancelAnimation();
        runningAnimations.delete(car.id);
    }
};

const runCarStart = async (
    page: HTMLElement,
    car: Car,
    lane: HTMLElement,
    vehicle: HTMLElement,
): Promise<void> => {
    try {
        await runEngine(car, lane, vehicle);
    } catch {
        renderGaragePage(page);
    }
};

const runCarStop = async (
    page: HTMLElement,
    car: Car,
    vehicle: HTMLElement,
): Promise<void> => {
    try {
        runningAnimations.get(car.id)?.();
        runningAnimations.delete(car.id);

        await stopCarEngine(car.id);

        vehicle.style.transform = "";
    } catch {
        renderGaragePage(page);
    }
};

const getRaceParticipants = (page: HTMLElement): RaceParticipant[] => {
    const lanes = [...page.querySelectorAll<HTMLElement>(".car-card__lane")];
    const vehicles = [...page.querySelectorAll<HTMLElement>(".car-card__vehicle")];

    return garageState.cars
        .map((car, index) => {
            const lane = lanes[index];
            const vehicle = vehicles[index];

            if (lane === undefined || vehicle === undefined) {
                return null;
            }

            return {car, lane, vehicle};
        })
        .filter((participant): participant is RaceParticipant => participant !== null);
};

const saveRaceWinner = (carId: number, seconds: number): void => {
    void saveWinner(carId, seconds).catch(() => {
        // The winner message is already shown; persistence is best-effort.
    });
};

const runRace = async (page: HTMLElement, message: HTMLElement): Promise<void> => {
    const participants = getRaceParticipants(page);
    let winnerName: string | null = null;

    message.textContent = "";

    const announceWinner = (car: Car, durationMs: number): void => {
        if (winnerName !== null) {
            return;
        }

        winnerName = car.name;

        const seconds = durationMs / MILLISECONDS_PER_SECOND;

        message.textContent = `${car.name} won! Time: ${seconds.toFixed(2)}s`;

        saveRaceWinner(car.id, seconds);
    };

    const runs = participants.map(({car, lane, vehicle}) => {
        return runEngine(car, lane, vehicle, announceWinner).catch(() => {
            runningAnimations.delete(car.id);
        });
    });

    await Promise.all(runs);
};

const resetRace = async (page: HTMLElement, message: HTMLElement): Promise<void> => {
    for (const cancelAnimation of runningAnimations.values()) {
        cancelAnimation();
    }

    runningAnimations.clear();

    message.textContent = "";

    await Promise.allSettled(garageState.cars.map((car) => stopCarEngine(car.id)));

    renderGaragePage(page);
};

const renderGaragePage = (page: HTMLElement): void => {
    page.replaceChildren(renderGarage({
        engineState: garageState.engineState,
        onCreate: (name, color) => {
            void runAction(page, () => applyCreateCar(name, color));
        },
        onGenerate: () => {
            void runAction(page, applyGenerateCars);
        },
        onPageChange: (nextPage) => {
            garageState.currentPage = nextPage;
            void runAction(page, loadGarage);
        },
        onSelect: (car) => {
            selectCar(car);
            renderGaragePage(page);
        },
        onRemove: (car) => {
            void runAction(page, () => applyDeleteCar(car));
        },
        onUpdate: (name, color) => {
            void runAction(page, () => applyUpdateCar(name, color));
        },
        onStart: (car, lane, vehicle) => {
            void runCarStart(page, car, lane, vehicle);
        },
        onStop: (car, vehicle) => {
            void runCarStop(page, car, vehicle);
        },
        onRaceStart: (message) => {
            void runRace(page, message);
        },
        onResetRace: (message) => {
            void resetRace(page, message);
        },
    }));
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement("main");

    page.textContent = "Loading Garage...";

    void runAction(page, loadGarage);

    return page;
};
