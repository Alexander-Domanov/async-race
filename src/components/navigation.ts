import {createButton} from "./button.ts";
import {getPageFromHash, navigate} from "../router/router.ts";
import type {Page} from "../types/types.ts";

export const createNavigation = (): HTMLElement => {
    const nav = document.createElement("nav");

    nav.classList.add("flex", "items-center", "gap-2");

    const garageButton = createButton({text: "Garage"});
    const winnersButton = createButton({text: "Winners"});

    const setActivePage = (page: Page): void => {
        garageButton.classList.toggle("nav-button--active", page === "garage");
        winnersButton.classList.toggle("nav-button--active", page === "winners");
    };

    garageButton.addEventListener("click", () => {
        navigate("garage");
    });

    winnersButton.addEventListener("click", () => {
        navigate("winners");
    });

    globalThis.addEventListener("hashchange", () => {
        setActivePage(getPageFromHash());
    });

    setActivePage(getPageFromHash());

    nav.append(garageButton, winnersButton);

    return nav;
};
