export const getTotalCount = (response: Response): number => {
    const header = response.headers.get("X-Total-Count");

    if (header === null) {
        throw new Error("Missing X-Total-Count");
    }

    const totalCount = Number(header);

    if (!Number.isInteger(totalCount) || totalCount < 0) {
        throw new Error("Invalid X-Total-Count");
    }

    return totalCount;
};
