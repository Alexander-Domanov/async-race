import {createCar, deleteCar, updateCar} from "../api/garage-api.ts";
import {deleteWinner} from "../api/winners-api.ts";
import {createButton} from "../components/button.ts";
import {createCarCard} from "../components/car-card.ts";
import {createPagination} from "../components/pagination.ts";
import {GARAGE_LIMIT} from "../constants.ts";
import {garageState, loadGarage} from "../state/garage-state.ts";
import type {Car} from "../types/types.ts";

interface CarFormProperties {
    nameValue: string;
    colorValue: string;
    submitText: string;
    submitDisabled?: boolean;
    onNameChange: (name: string) => void;
    onColorChange: (color: string) => void;
    onSubmit: () => void;
}

interface GarageRenderProperties {
    onCreate: (name: string, color: string) => void;
    onPageChange: (page: number) => void;
    onSelect: (car: Car) => void;
    onRemove: (car: Car) => void;
    onUpdate: (name: string, color: string) => void;
}

const createCarForm = ({
    nameValue,
    colorValue,
    submitText,
    submitDisabled = false,
    onNameChange,
    onColorChange,
    onSubmit,
}: CarFormProperties): HTMLFormElement => {
    const form = document.createElement("form");

    form.classList.add(
        "garage-form",
        "flex",
        "items-center",
        "gap-2",
        "flex-wrap",
    );

    const nameInput = document.createElement("input");

    nameInput.type = "text";
    nameInput.placeholder = "Car name";
    nameInput.value = nameValue;

    const colorInput = document.createElement("input");

    colorInput.type = "color";
    colorInput.value = colorValue;

    const submitButton = createButton({
        text: submitText,
        type: "submit",
        disabled: submitDisabled,
    });

    nameInput.addEventListener("input", () => {
        onNameChange(nameInput.value);
    });

    colorInput.addEventListener("input", () => {
        onColorChange(colorInput.value);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        onSubmit();
    });

    form.append(nameInput, colorInput, submitButton);

    return form;
};

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

const createCarList = (
    onSelect: (car: Car) => void,
    onRemove: (car: Car) => void,
): HTMLElement => {
    const list = document.createElement("div");

    list.classList.add(
        "garage-list",
        "flex",
        "flex-col",
        "gap-4",
    );

    for (const car of garageState.cars) {
        list.append(createCarCard({
            car,
            isSelected: garageState.selectedCarId === car.id,
            onSelect,
            onRemove,
        }));
    }

    return list;
};

const renderGarage = ({
    onCreate,
    onPageChange,
    onSelect,
    onRemove,
    onUpdate,
}: GarageRenderProperties): HTMLElement => {
    const container = document.createElement("div");

    const heading = document.createElement("h2");

    heading.textContent = "Garage Page";

    const info = document.createElement("p");

    info.classList.add("text-slate-400");
    info.textContent = `Page ${garageState.currentPage}, Total Cars: ${garageState.totalCount}`;

    const totalPages = Math.max(1, Math.ceil(garageState.totalCount / GARAGE_LIMIT));

    container.append(
        heading,
        info,
        createCreateForm(onCreate),
        createUpdateForm(onUpdate),
        createCarList(onSelect, onRemove),
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

const renderGaragePage = (page: HTMLElement): void => {
    page.replaceChildren(renderGarage({
        onCreate: (name, color) => {
            void createCarAndReload(page, name, color);
        },
        onPageChange: (nextPage) => {
            garageState.currentPage = nextPage;
            void loadGaragePage(page);
        },
        onSelect: (car) => {
            selectCar(car);
            renderGaragePage(page);
        },
        onRemove: (car) => {
            void removeCarAndReload(page, car);
        },
        onUpdate: (name, color) => {
            void updateCarAndReload(page, name, color);
        },
    }));
};

const loadGaragePage = async (page: HTMLElement): Promise<void> => {
    try {
        await loadGarage();
        renderGaragePage(page);
    } catch (error: unknown) {
        showError(page, error);
    }
};

const selectCar = (car: Car): void => {
    garageState.selectedCarId = car.id;
    garageState.updateName = car.name;
    garageState.updateColor = car.color;
};

const createCarAndReload = async (page: HTMLElement, name: string, color: string): Promise<void> => {
    if (name.length === 0) {
        return;
    }

    try {
        await createCar({name, color});

        garageState.currentPage = Math.max(1, Math.ceil((garageState.totalCount + 1) / GARAGE_LIMIT));

        await loadGaragePage(page);
    } catch (error: unknown) {
        showError(page, error);
    }
};

const updateCarAndReload = async (page: HTMLElement, name: string, color: string): Promise<void> => {
    const selectedCarId = garageState.selectedCarId;

    if (selectedCarId === null || name.length === 0) {
        return;
    }

    try {
        await updateCar(selectedCarId, {name, color});

        await loadGaragePage(page);
    } catch (error: unknown) {
        showError(page, error);
    }
};

const removeCarAndReload = async (page: HTMLElement, car: Car): Promise<void> => {
    try {
        await deleteCar(car.id);
        await deleteWinner(car.id);

        if (garageState.selectedCarId === car.id) {
            garageState.selectedCarId = null;
        }

        if (garageState.cars.length <= 1 && garageState.currentPage > 1) {
            garageState.currentPage -= 1;
        }

        await loadGaragePage(page);
    } catch (error: unknown) {
        showError(page, error);
    }
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement("main");

    page.textContent = "Loading Garage...";

    void loadGaragePage(page);

    return page;
};
