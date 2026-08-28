import {getCar} from "../api/garage-api.ts";
import {createButton} from "../components/button.ts";
import {createCarImage} from "../components/car-image.ts";
import {createPagination} from "../components/pagination.ts";
import {WINNERS_LIMIT} from "../constants.ts";
import {loadWinners, setWinnersSort, winnersState} from "../state/winners-state.ts";
import type {Car, Winner, WinnersSortField, WinnersSortOrder} from "../types/types.ts";

interface WinnerRowData {
    position: number;
    winner: Winner;
    car: Car;
}

const SORT_INDICATORS: Record<WinnersSortOrder, string> = {
    ASC: "▲",
    DESC: "▼",
};

const showError = (page: HTMLElement, error: unknown): void => {
    page.textContent = error instanceof Error
        ? error.message
        : "Unknown error";
};

const runAction = async (page: HTMLElement, action: () => Promise<void>): Promise<void> => {
    try {
        await action();
    } catch (error: unknown) {
        showError(page, error);
    }
};

const createWinnersInfo = (): HTMLElement => {
    const info = document.createElement("p");

    info.classList.add("text-slate-400");
    info.textContent = `Page ${winnersState.currentPage}, Total Records: ${winnersState.totalCount}`;

    return info;
};

const createSortButton = (
    label: string,
    field: WinnersSortField,
    onSort: (field: WinnersSortField) => void,
): HTMLButtonElement => {
    const isActive = winnersState.sortField === field;
    const indicator = isActive ? ` ${SORT_INDICATORS[winnersState.sortOrder]}` : "";
    const button = createButton({text: `${label}${indicator}`});

    button.addEventListener("click", () => {
        onSort(field);
    });

    return button;
};

const createHeaderCell = (content: Node | string): HTMLTableCellElement => {
    const cell = document.createElement("th");

    cell.append(content);

    return cell;
};

const createTableHead = (onSort: (field: WinnersSortField) => void): HTMLTableSectionElement => {
    const head = document.createElement("thead");
    const row = document.createElement("tr");

    row.append(
        createHeaderCell("№"),
        createHeaderCell("Car"),
        createHeaderCell("Name"),
        createHeaderCell(createSortButton("Wins", "wins", onSort)),
        createHeaderCell(createSortButton("Best time (s)", "time", onSort)),
    );

    head.append(row);

    return head;
};

const createDataCell = (content: Node | string): HTMLTableCellElement => {
    const cell = document.createElement("td");

    cell.append(content);

    return cell;
};

const createTableRow = ({position, winner, car}: WinnerRowData): HTMLTableRowElement => {
    const row = document.createElement("tr");

    row.append(
        createDataCell(String(position)),
        createDataCell(createCarImage(car.color)),
        createDataCell(car.name),
        createDataCell(String(winner.wins)),
        createDataCell(winner.time.toFixed(2)),
    );

    return row;
};

const loadRowData = async (winners: Winner[]): Promise<WinnerRowData[]> => {
    const entries = await Promise.all(winners.map(async (winner, index) => {
        const car = await getCar(winner.id);

        if (car === null) {
            return null;
        }

        return {
            position: (winnersState.currentPage - 1) * WINNERS_LIMIT + index + 1,
            winner,
            car,
        };
    }));

    return entries.filter((entry): entry is WinnerRowData => entry !== null);
};

const createWinnersTable = (
    onSort: (field: WinnersSortField) => void,
): {table: HTMLTableElement; body: HTMLTableSectionElement} => {
    const table = document.createElement("table");
    const body = document.createElement("tbody");

    table.classList.add("winners-table", "w-full", "border-collapse");
    table.append(createTableHead(onSort), body);

    return {table, body};
};

const handleSort = (page: HTMLElement, field: WinnersSortField): void => {
    setWinnersSort(field);

    void runAction(page, async () => {
        await loadWinners();
        await renderWinnersPage(page);
    });
};

const handlePageChange = (page: HTMLElement, nextPage: number): void => {
    winnersState.currentPage = nextPage;

    void runAction(page, async () => {
        await loadWinners();
        await renderWinnersPage(page);
    });
};

const renderWinnersPage = async (page: HTMLElement): Promise<void> => {
    const container = document.createElement("div");
    const heading = document.createElement("h2");

    heading.textContent = "Winners Page";

    const totalPages = Math.max(1, Math.ceil(winnersState.totalCount / WINNERS_LIMIT));

    const {table, body} = createWinnersTable((field) => {
        void handleSort(page, field);
    });

    const pagination = createPagination({
        currentPage: winnersState.currentPage,
        totalPages,
        onPageChange: (nextPage) => {
            void handlePageChange(page, nextPage);
        },
    });

    container.append(heading, createWinnersInfo(), table, pagination);
    page.replaceChildren(container);

    const rows = await loadRowData(winnersState.winners);

    body.append(...rows.map((row) => createTableRow(row)));
};

export const createWinnersPage = (): HTMLElement => {
    const page = document.createElement("main");

    page.textContent = "Loading Winners...";

    void runAction(page, async () => {
        await loadWinners();
        await renderWinnersPage(page);
    });

    return page;
};
