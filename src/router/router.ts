import {createGaragePage} from "../pages/garage-page.ts";
import {createWinnersPage} from "../pages/winners-page.ts";
import type {Page} from "../types/types.ts";

const GARAGE_HASH = "#garage";
const WINNERS_HASH = "#winners";

export const getPageFromHash = (): Page => {
    return globalThis.location.hash === WINNERS_HASH ? "winners" : "garage";
};

export const navigate = (page: Page): void => {
    globalThis.location.hash = page;
};

export const initRouter = (viewContainer: HTMLElement): void => {
    const render = (): void => {
        const page = getPageFromHash();

        if (globalThis.location.hash !== GARAGE_HASH && globalThis.location.hash !== WINNERS_HASH) {
            globalThis.history.replaceState(null, "", GARAGE_HASH);
        }

        viewContainer.replaceChildren();

        viewContainer.append(page === "winners" ? createWinnersPage() : createGaragePage());
    };

    globalThis.addEventListener("hashchange", render);

    render();
};
