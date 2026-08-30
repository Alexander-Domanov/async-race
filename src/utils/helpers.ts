import {CAR_BRANDS, CAR_MODELS} from "../constants.ts";

export const pickRandom = (items: string[]): string => {
    const index = Math.floor(Math.random() * items.length);
    const item = items[index];

    if (item === undefined) {
        throw new Error("Cannot pick from an empty array");
    }

    return item;
};

export const generateRandomColor = (): string => {
    const channels = Array.from({length: 3}, () => {
        return Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0");
    });

    return `#${channels.join("")}`;
};

export const generateCarName = (): string => {
    return `${pickRandom(CAR_BRANDS)} ${pickRandom(CAR_MODELS)}`;
};
