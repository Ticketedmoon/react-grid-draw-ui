import { RectangleCreationManager } from "./rectangleCreationManager";
import { GridRectangle } from "../types/grid.rectangle.type";
export declare class PublicFunctionManager {
    private readonly CANVAS_WRAP_ID;
    private canvas;
    private readonly rectangleCreationManager;
    private readonly canvasRect;
    constructor(canvas: HTMLCanvasElement, rectangleCreationManager: RectangleCreationManager);
    getItemsWithinRegion: () => string[][][];
    drawRectanglesFromPayload: (rects: GridRectangle[]) => void;
    clearDownGrids: () => void;
    private buildTableRowsFromDrawnGrid;
    private addGridItemToTable;
    private buildTableShape;
    private findGridPosition;
    private isItemInsideBox;
}
