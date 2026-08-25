import './style.css'
import {createNavigation} from "./components/navigation.ts";
import {initRouter} from "./router/router.ts";
import type {Page} from "./types/types.ts";

const app = document.querySelector<HTMLDivElement>('#app');

if (app === null) {
    throw new Error('App element not found');
}

const viewContainer = document.createElement('div');

const handleNavigate = (page: Page): void => {
    initRouter(viewContainer, page);
};

const navigation = createNavigation(handleNavigate, 'garage');

app.innerHTML = `
  <h1 class="text-4xl font-bold text-slate-100">
    Async Race
  </h1>
`;

app.append(navigation, viewContainer);

initRouter(viewContainer, 'garage');
