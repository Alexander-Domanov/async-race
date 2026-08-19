interface ButtonProperties {
    text: string;
    disabled?: boolean;
    type?: 'button' | 'submit';
}

export const createButton = (
    {
        text,
        disabled = false,
        type = 'button',
    }:ButtonProperties): HTMLButtonElement => {
    const button = document.createElement('button');

    button.textContent = text;
    button.type = type;
    button.disabled = disabled;
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
