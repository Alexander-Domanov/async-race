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
    garageState,
    loadGarage,
    selectCar,
} from "../state/garage-state.ts";
import type {Car} from "../types/types.ts";

interface GarageRenderProperties {
    onCreate: (name: string, color: string) => void;
    onGenerate: () => void;
    onPageChange: (page: number) => void;
    onSelect: (car: Car) => void;
    onRemove: (car: Car) => void;
    onUpdate: (name: string, color: string) => void;
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
    onCreate,
    onGenerate,
    onPageChange,
    onSelect,
    onRemove,
    onUpdate,
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
            onSelect,
            onRemove,
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

const renderGaragePage = (page: HTMLElement): void => {
    page.replaceChildren(renderGarage({
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
    }));
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement("main");

    page.textContent = "Loading Garage...";

    void runAction(page, loadGarage);

    return page;
};
