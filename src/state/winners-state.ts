import {createWinner, getWinner, getWinners, updateWinner} from "../api/winners-api.ts";
import type {WinnersSortField, WinnersState} from "../types/types.ts";

export const winnersState: WinnersState = {
    winners: [],
    totalCount: 0,
    currentPage: 1,
    sortField: "id",
    sortOrder: "ASC",
};

export const loadWinners = async (): Promise<void> => {
    const result = await getWinners(
        winnersState.currentPage,
        winnersState.sortField,
        winnersState.sortOrder,
    );

    winnersState.winners = result.winners;
    winnersState.totalCount = result.totalCount;
};

export const setWinnersSort = (sortField: WinnersSortField): void => {
    if (winnersState.sortField === sortField) {
        winnersState.sortOrder = winnersState.sortOrder === "ASC" ? "DESC" : "ASC";
    } else {
        winnersState.sortField = sortField;
        winnersState.sortOrder = "ASC";
    }

    winnersState.currentPage = 1;
};

export const saveWinner = async (carId: number, timeSeconds: number): Promise<void> => {
    const existing = await getWinner(carId);

    if (existing === null) {
        await createWinner({id: carId, wins: 1, time: timeSeconds});
        return;
    }

    await updateWinner(carId, {
        wins: existing.wins + 1,
        time: Math.min(existing.time, timeSeconds),
    });
};
