import {createGaragePage} from "../pages/garage-page.ts";
import {createWinnersPage} from "../pages/winners-page.ts";
import type {Page} from "../types/types.ts";

export const initRouter = (viewContainer: HTMLElement, page: Page): void => {
    viewContainer.replaceChildren();

    switch (page) {
        case 'garage': {
            viewContainer.append(createGaragePage());
            break;
        }
        case 'winners': {
            viewContainer.append(createWinnersPage());
            break;
        }
    }
};
