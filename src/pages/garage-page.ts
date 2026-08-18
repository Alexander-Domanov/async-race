import {garageState, loadGarage} from "../state/garage-state.ts";

const renderGarage = (): HTMLElement => {
    const container = document.createElement('div');

    const info = document.createElement('p');

    info.textContent = `Page ${garageState.currentPage}, Total Cars: ${garageState.totalCount}`;

    container.append(info);

    for (const car of garageState.cars) {
        const item = document.createElement('p');

        item.textContent = car.name;
        container.append(item);
    }

    return container;
}

const initializePage = async (page: HTMLElement): Promise<void> => {
    try {
        await loadGarage();

        page.textContent = 'Garage Page';

        page.append(renderGarage());
    } catch (error: unknown) {

        page.textContent = error instanceof Error
            ? error.message
            : "Unknown error";
    }
};

export const createGaragePage = (): HTMLElement => {
    const page = document.createElement('main');

    page.textContent = 'Loading Garage...';

    void initializePage(page);
    
    return page;
};
