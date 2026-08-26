import {garageState, loadGarage} from "../state/garage-state.ts";
import {createCar} from "../api/garage-api.ts";
import {createCarCard} from "../components/car-card.ts";
import {createPagination} from "../components/pagination.ts";
import {createButton} from "../components/button.ts";
import {GARAGE_LIMIT} from "../constants.ts";

const createCarList = (): HTMLElement => {
    const list = document.createElement('div');

    list.classList.add(
        'garage-list',
        'flex',
        'flex-col',
        'gap-4',
    );

    for (const car of garageState.cars) {
        list.append(
            createCarCard(car),
        );
    }

    return list;
};

const createCarForm = (onCreate: (name: string, color: string) => void): HTMLElement => {
    const form = document.createElement('form');

    form.classList.add(
        'garage-form',
        'flex',
        'items-center',
        'gap-2',
        'flex-wrap',
    );

    const nameInput = document.createElement('input');

    nameInput.type = 'text';
    nameInput.placeholder = 'Car name';
    nameInput.value = garageState.createName;

    const colorInput = document.createElement('input');

    colorInput.type = 'color';
    colorInput.value = garageState.createColor;

    const submitButton = createButton({text: 'Create', type: 'submit'});
    nameInput.addEventListener('input', () => {
        garageState.createName = nameInput.value;
    });

    colorInput.addEventListener('input', () => {
        garageState.createColor = colorInput.value;
    });
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        onCreate(garageState.createName.trim(), garageState.createColor);
    });

    form.append(nameInput, colorInput, submitButton);

    return form;
};

const renderGarage = (
    onPageChange: (page: number) => void,
    onCreate: (name: string, color: string) => void,
): HTMLElement => {
    const container = document.createElement('div');

    const heading = document.createElement('h2');

    heading.textContent = 'Garage Page';

    const info = document.createElement('p');

    info.classList.add('text-slate-400');

    info.textContent = `Page ${garageState.currentPage}, Total Cars: ${garageState.totalCount}`;

    const form = createCarForm(onCreate);

    const totalPages = Math.max(1, Math.ceil(garageState.totalCount / GARAGE_LIMIT));

    const pagination = createPagination({
        currentPage: garageState.currentPage,
        totalPages,
        onPageChange,
    });

    container.append(
        heading,
        info,
        form,
        createCarList(),
        pagination,
    );

    return container;
};

const reloadGarage = async (page: HTMLElement): Promise<void> => {
    try {
        await loadGarage();

        page.replaceChildren(renderGarage(
            (nextPage: number) => {
                garageState.currentPage = nextPage;
                void reloadGarage(page);
            },
            (name: string, color: string) => {
                void createCarAndReload(page, name, color);
            },
        ));
    } catch (error: unknown) {
        page.textContent = error instanceof Error
            ? error.message
            : "Unknown error";
    }
};

const createCarAndReload = async (page: HTMLElement, name: string, color: string): Promise<void> => {
    if (name.length === 0) {
        return;
    }

    try {
        await createCar({name, color});

        garageState.currentPage = Math.max(1, Math.ceil((garageState.totalCount + 1) / GARAGE_LIMIT));

        await reloadGarage(page);
    } catch (error: unknown) {
        page.textContent = error instanceof Error
            ? error.message
            : "Unknown error";
    }
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement('main');

    page.textContent = 'Loading Garage...';

    void reloadGarage(page);

    return page;
};
