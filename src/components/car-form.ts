import {createButton} from "./button.ts";

interface CarFormProperties {
    nameValue: string;
    colorValue: string;
    submitText: string;
    submitDisabled?: boolean;
    onNameChange: (name: string) => void;
    onColorChange: (color: string) => void;
    onSubmit: () => void;
}

const createNameInput = (value: string): HTMLInputElement => {
    const nameInput = document.createElement("input");

    nameInput.type = "text";
    nameInput.placeholder = "Car name";
    nameInput.setAttribute("aria-label", "Car name");
    nameInput.value = value;

    return nameInput;
};

const createColorInput = (value: string): HTMLInputElement => {
    const colorInput = document.createElement("input");

    colorInput.type = "color";
    colorInput.setAttribute("aria-label", "Car color");
    colorInput.value = value;

    return colorInput;
};

export const createCarForm = ({
    nameValue,
    colorValue,
    submitText,
    submitDisabled = false,
    onNameChange,
    onColorChange,
    onSubmit,
}: CarFormProperties): HTMLFormElement => {
    const form = document.createElement("form");

    form.classList.add("garage-form", "flex", "items-center", "gap-2", "flex-wrap");

    const nameInput = createNameInput(nameValue);
    const colorInput = createColorInput(colorValue);
    const submitButton = createButton({text: submitText, type: "submit", disabled: submitDisabled});

    nameInput.addEventListener("input", () => {
        onNameChange(nameInput.value);
    });

    colorInput.addEventListener("input", () => {
        onColorChange(colorInput.value);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        onSubmit();
    });

    form.append(nameInput, colorInput, submitButton);

    return form;
};
