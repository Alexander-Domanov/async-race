import {createButton} from "../components/button.ts";
import {createCarForm} from "../components/car-form.ts";
import {createCarList} from "../components/car-list.ts";
import {createPagination} from "../components/pagination.ts";
import {GARAGE_LIMIT} from "../constants.ts";
import {
    applyCreateCar,
    applyDeleteCar,
    applyGenerateCars,
    applyUpdateCar,
    driveCarEngine,
    garageState,
    loadGarage,
    markEngineFinished,
    selectCar,
    startCarEngine,
    stopCarEngine,
} from "../state/garage-state.ts";
import type {Car, EngineCarState} from "../types/types.ts";
import {animateCar} from "../utils/animation.ts";

const runningAnimations = new Map<number, () => void>();

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
}: GarageRenderProperties): HTMLElement => {
    const container = document.createElement("div");

    const heading = document.createElement("h2");

    heading.textContent = "Garage Page";

    const totalPages = Math.max(1, Math.ceil(garageState.totalCount / GARAGE_LIMIT));

    container.append(
        heading,
        createGarageInfo(),
        createCreateForm(onCreate),
        createUpdateForm(onUpdate),
        createGenerateButton(onGenerate),
        createCarList({
            cars: garageState.cars,
            selectedCarId: garageState.selectedCarId,
            engineState,
            onSelect,
            onRemove,
            onStart,
            onStop,
        }),
        createPagination({
            currentPage: garageState.currentPage,
            totalPages,
            onPageChange,
        }),
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

const runCarStart = async (
    page: HTMLElement,
    car: Car,
    lane: HTMLElement,
    vehicle: HTMLElement,
): Promise<void> => {
    try {
        const engine = await startCarEngine(car.id);
        const durationMs = engine.distance / engine.velocity;
        const cancelAnimation = animateCar(lane, vehicle, durationMs, () => {
            runningAnimations.delete(car.id);
            markEngineFinished(car.id);
        });

        runningAnimations.set(car.id, cancelAnimation);

        const isDriving = await driveCarEngine(car.id);

        if (!isDriving) {
            cancelAnimation();
            runningAnimations.delete(car.id);
        }
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
    }));
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement("main");

    page.textContent = "Loading Garage...";

    void runAction(page, loadGarage);

    return page;
};
