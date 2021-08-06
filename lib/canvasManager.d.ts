import { ReactGridDrawLineRequiredProperties } from "../types/react.grid.line.properties.type";
export declare class CanvasManager {
    private readonly lineProperties;
    private canvas;
    private ctx;
    private rectangleCreationManager;
    private rectangleBoundaryValidator;
    private currentRect;
    private drag;
    private activeDragLine;
    constructor(lineProperties: ReactGridDrawLineRequiredProperties);
    createCanvas: (containerWidth: number, containerHeight: number) => void;
    setCanvasSize: (containerWidth: number, containerHeight: number) => void;
    mouseDown: (e: MouseEvent) => void;
    mouseUp: (e: MouseEvent) => void;
    mouseMove: (e: MouseEvent) => void;
    private setUpMouseEvents;
    private setUpKeyboardEvents;
    private resetActiveGridLineForDragging;
    private drawInteractableGrids;
    private render;
}
