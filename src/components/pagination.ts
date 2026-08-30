import {createButton} from "./button.ts";

interface PaginationProperties {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const createPagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProperties): HTMLElement => {
    const pagination = document.createElement("div");

    pagination.classList.add("pagination", "flex", "items-center", "gap-2");

    const previousButton = createButton({
        text: "Previous",
        disabled: currentPage <= 1,
    });

    const nextButton = createButton({
        text: "Next",
        disabled: currentPage >= totalPages,
    });

    previousButton.addEventListener("click", () => {
        onPageChange(currentPage - 1);
    });

    nextButton.addEventListener("click", () => {
        onPageChange(currentPage + 1);
    });

    pagination.append(previousButton, nextButton);

    return pagination;
};
