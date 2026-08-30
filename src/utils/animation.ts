export const animateCar = (
    lane: HTMLElement,
    vehicle: HTMLElement,
    durationMs: number,
    onFinish: () => void,
): () => void => {
    let frameId = 0;
    const startedAt = performance.now();

    const step = (now: number): void => {
        const progress = Math.min(1, (now - startedAt) / durationMs);
        const distance = Math.max(0, lane.clientWidth - vehicle.clientWidth);
        const offset = distance * progress;

        vehicle.style.transform = `translateX(${offset}px)`;

        if (progress < 1) {
            frameId = requestAnimationFrame(step);
        } else {
            onFinish();
        }
    };

    frameId = requestAnimationFrame(step);

    return () => {
        cancelAnimationFrame(frameId);
    };
};
