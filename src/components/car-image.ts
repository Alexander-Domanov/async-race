// eslint-disable-next-line unicorn/prefer-https
const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

const setAttributes = (
    element: Element,
    attributes: Record<string, string>,
): void => {
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
};

const createCircle = (
    attributes: Record<string, string>,
): SVGCircleElement => {
    const circle = document.createElementNS(
        SVG_NAMESPACE,
        "circle",
    );

    setAttributes(circle, attributes);

    return circle;
};

const createShadow = (): SVGEllipseElement => {
    const shadow = document.createElementNS(
        SVG_NAMESPACE,
        "ellipse",
    );

    setAttributes(shadow, {
        cx: "125",
        cy: "85",
        rx: "90",
        ry: "8",
        fill: "rgba(0,0,0,0.3)",
    });

    return shadow;
};

const createBody = (
    color: string,
): SVGPathElement => {
    const body = document.createElementNS(
        SVG_NAMESPACE,
        "path",
    );

    setAttributes(body, {
        d: `
            M35 60
            L55 40
            L90 40
            L110 25
            L155 25
            L185 60
            Z
        `,
        fill: color,
    });

    return body;
};

const createCabin = (): SVGPathElement => {
    const cabin = document.createElementNS(
        SVG_NAMESPACE,
        "path",
    );

    setAttributes(cabin, {
        d: `
            M90 40
            L110 25
            L155 25
            L170 40
            Z
        `,
        fill: "#64748b",
    });

    return cabin;
};

const createWindows = (): SVGPathElement => {
    const windows = document.createElementNS(
        SVG_NAMESPACE,
        "path",
    );

    setAttributes(windows, {
        d: `
            M105 28
            L150 28
            L165 38
            L100 38
            Z
        `,
        fill: "#1e293b",
    });

    return windows;
};

const createLights = (): SVGGElement => {
    const lights = document.createElementNS(
        SVG_NAMESPACE,
        "g",
    );

    const frontLight = createCircle({
        cx: "182",
        cy: "52",
        r: "5",
        fill: "#fde047",
    });

    const rearLight = createCircle({
        cx: "40",
        cy: "52",
        r: "4",
        fill: "#ef4444",
    });

    lights.append(frontLight, rearLight);

    return lights;
};

const createWheel = (
    cx: number,
    cy: number,
): SVGGElement => {
    const wheel = document.createElementNS(
        SVG_NAMESPACE,
        "g",
    );

    wheel.classList.add("car-image__wheel");

    const tire = createCircle({
        cx: String(cx),
        cy: String(cy),
        r: "15",
        fill: "#111827",
    });

    const rim = createCircle({
        cx: String(cx),
        cy: String(cy),
        r: "6",
        fill: "#94a3b8",
    });

    wheel.append(tire, rim);

    return wheel;
};

const createDetailLine = (): SVGLineElement => {
    const detailLine = document.createElementNS(
        SVG_NAMESPACE,
        "line",
    );

    setAttributes(detailLine, {
        x1: "55",
        y1: "55",
        x2: "170",
        y2: "55",
        stroke: "#cbd5e1",
        "stroke-width": "2",
    });

    return detailLine;
};

const appendCarParts = (
    svg: SVGSVGElement,
    color: string,
): void => {
    const shadow = createShadow();
    const body = createBody(color);
    const cabin = createCabin();
    const windows = createWindows();
    const lights = createLights();
    const wheelLeft = createWheel(75, 70);
    const wheelRight = createWheel(175, 70);
    const detailLine = createDetailLine();

    svg.append(
        shadow,
        body,
        cabin,
        windows,
        lights,
        wheelLeft,
        wheelRight,
        detailLine,
    );
};

export const createCarImage = (
    color: string,
): SVGSVGElement => {
    const svg = document.createElementNS(
        SVG_NAMESPACE,
        "svg",
    );

    setAttributes(svg, {
        viewBox: "0 0 250 100",
        preserveAspectRatio: "xMidYMid meet",
        "aria-hidden": "true",
    });

    svg.classList.add(
        "car-image",
        "w-full",
        "max-w-[250px]",
        "h-auto",
        "block",
    );

    appendCarParts(svg, color);

    return svg;
};
