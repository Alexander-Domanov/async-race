import "./style.css";
import {createNavigation} from "./components/navigation.ts";
import {initRouter} from "./router/router.ts";

const app = document.querySelector<HTMLDivElement>("#app");

if (app === null) {
    throw new Error("App element not found");
}

const viewContainer = document.createElement("div");

const navigation = createNavigation();

app.innerHTML = `
  <h1 class="text-4xl font-bold text-slate-100">
    Async Race
  </h1>
`;

app.append(navigation, viewContainer);

initRouter(viewContainer);
