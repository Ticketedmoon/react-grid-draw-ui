import { RectangleCreationManager } from "./rectangleCreationManager";
export declare class PublicFunctionManager {
    private canvas;
    private readonly containerID;
    private readonly rectangleCreationManager;
    private readonly rectangles;
    private readonly canvasRect;
    constructor(canvas: HTMLCanvasElement, rectangles: GridRectangle[], containerID: string, rectangleCreationManager: RectangleCreationManager);
    getItemsWithinRegion: () => string[][][];
    undoLastRectangle: () => void;
    undoLastDrawnLineForLatestRectangle: () => void;
    private undoLastDrawnLineForRectangle;
    private buildTableFromBox;
    private findGridPosition;
    private isItemInsideBox;
}
