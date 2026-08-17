export const createButton = (text: string): HTMLButtonElement => {
    const button = document.createElement('button');

    button.textContent = text;
    button.classList.add(
        'px-4',
        'py-2',
        'rounded',
        'border',
        'cursor-pointer',
        'transition',
        'hover:bg-gray-200',
        'active:scale-95',
    );
    
    return button;
};
