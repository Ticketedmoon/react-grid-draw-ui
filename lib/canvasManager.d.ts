export declare class CanvasManager {
    private readonly rectangles;
    private readonly lineProperties;
    private canvas;
    private ctx;
    private rectangleCreationManager;
    private rectangleBoundaryValidator;
    private currentRect;
    private drag;
    private body;
    constructor(lineProperties: ReactGridDrawLineRequiredProperties);
    createCanvas: (containerWidth: number, containerHeight: number) => void;
    setCanvasSize: (containerWidth: number, containerHeight: number) => void;
    mouseDown: (e: MouseEvent) => void;
    mouseUp: (e: MouseEvent) => void;
    mouseMove: (e: MouseEvent) => void;
    private drawAllCreatedRectangles;
    private buildRectanglesWithMouseChecks;
}
