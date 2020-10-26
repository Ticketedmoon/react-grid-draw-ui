export declare class CanvasManager {
    private readonly rectangles;
    private readonly lineProperties;
    private canvas;
    private ctx;
    private rectangleCreationManager;
    private rectangleBoundaryValidator;
    private currentRect;
    private containerID;
    private drag;
    private body;
    constructor(lineProperties: ReactGridDrawLineRequiredProperties);
    createCanvas: (containerID: string) => void;
    setCanvasSize: () => void;
    mouseDown: (e: MouseEvent) => void;
    mouseUp: (e: MouseEvent) => void;
    mouseMove: (e: MouseEvent) => void;
    private drawAllCreatedRectangles;
    private buildRectanglesWithMouseChecks;
}
