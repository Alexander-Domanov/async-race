import {API_URL, HTTP_NOT_FOUND} from "../constants.ts";

export const deleteWinner = async (id: number): Promise<void> => {
    const url = new URL(`/winners/${id}`, API_URL);

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (!response.ok && response.status !== HTTP_NOT_FOUND) {
        throw new Error(`Delete winner request failed: ${response.status}`);
    }
};
