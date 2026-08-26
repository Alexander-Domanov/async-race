import {createButton} from "./button.ts";
import type {Page} from "../types/types.ts";

export const createNavigation = (
    onNavigate: (page: Page) => void,
    initialPage: Page,
): HTMLElement => {
    const nav = document.createElement("nav");

    const garageButton = createButton({text: "Garage"});
    const winnersButton = createButton({text: "Winners"});

    const setActivePage = (page: Page): void => {
        garageButton.classList.toggle("nav-button--active", page === "garage");
        winnersButton.classList.toggle("nav-button--active", page === "winners");
    };

    garageButton.addEventListener("click", () => {
        setActivePage("garage");
        onNavigate("garage");
    });

    winnersButton.addEventListener("click", () => {
        setActivePage("winners");
        onNavigate("winners");
    });

    setActivePage(initialPage);

    nav.append(garageButton, winnersButton);

    return nav;
};
