import {createButton} from "./button.ts";
import type {Page} from "../types/types.ts";

export const createNavigation = (onNavigate: (page: Page) => void): HTMLElement => {
    const nav = document.createElement('nav');

    const garageButton = createButton('Garage');
    const winnersButton = createButton('Winners');
    
    garageButton.addEventListener('click', () => {
        onNavigate('garage');
    })

    winnersButton.addEventListener('click', () => {
        onNavigate('winners');
    })

    nav.append(garageButton, winnersButton);
    
    return nav;
}
