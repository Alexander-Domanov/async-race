import './style.css'

const app = document.querySelector<HTMLDivElement>('#app');

if (app === null) {
    throw new Error('App element not found');
}

app.innerHTML = `
  <h1 class="text-4xl font-bold text-blue-500">
    Async Race
  </h1>
`;
