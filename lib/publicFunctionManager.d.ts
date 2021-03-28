import { RectangleCreationManager } from "./rectangleCreationManager";
export declare class PublicFunctionManager {
    private readonly CANVAS_WRAP_ID;
    private canvas;
    private readonly rectangleCreationManager;
    private readonly rectangles;
    private readonly canvasRect;
    constructor(canvas: HTMLCanvasElement, rectangles: GridRectangle[], rectangleCreationManager: RectangleCreationManager);
    getItemsWithinRegion: () => string[][][];
    private buildTableRowsFromDrawnGrid;
    private addGridItemToTable;
    undoLastRectangle: () => void;
    undoLastDrawnLineForLatestRectangle: () => void;
    private undoLastDrawnLineForRectangle;
    private buildTableShape;
    private findGridPosition;
    private isItemInsideBox;
}
