import {garageState, loadGarage} from "../state/garage-state.ts";
import {createCarCard} from "../components/car-card.ts";
import {createPagination} from "../components/pagination.ts";
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

const renderGarage = (onPageChange: (page: number) => void): HTMLElement => {
    const container = document.createElement('div');

    const heading = document.createElement('h2');

    heading.textContent = 'Garage Page';

    const info = document.createElement('p');

    info.classList.add('text-slate-400');

    info.textContent = `Page ${garageState.currentPage}, Total Cars: ${garageState.totalCount}`;

    const totalPages = Math.max(1, Math.ceil(garageState.totalCount / GARAGE_LIMIT));

    const pagination = createPagination({
        currentPage: garageState.currentPage,
        totalPages,
        onPageChange,
    });

    container.append(
        heading,
        info,
        createCarList(),
        pagination,
    );

    return container;
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement('main');

    page.textContent = 'Loading Garage...';

    const loadPage = async (): Promise<void> => {
        try {
            await loadGarage();

            page.replaceChildren(renderGarage((nextPage: number) => {
                garageState.currentPage = nextPage;
                void loadPage();
            }));
        } catch (error: unknown) {
            page.textContent = error instanceof Error
                ? error.message
                : "Unknown error";
        }
    };

    void loadPage();

    return page;
};
