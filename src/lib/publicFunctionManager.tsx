import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleManagerUtil} from "./rectangleManagerUtil";
import {GridRectangle} from "../types/grid.rectangle.type";
import {HorizontalLineType} from "../types/horizontal.line.type";
import {VerticalLineType} from "../types/vertical.line.type";

export class PublicFunctionManager {

    private readonly CANVAS_WRAP_ID: string = "canvas-wrap";

    private canvas: HTMLCanvasElement;

    private readonly rectangleCreationManager: RectangleCreationManager;
    private readonly canvasRect: DOMRect;

    constructor(canvas: HTMLCanvasElement, rectangleCreationManager: RectangleCreationManager) {
        this.canvas = canvas;
        this.rectangleCreationManager = rectangleCreationManager;
        this.canvasRect = this.canvas.getBoundingClientRect();
    }

    getItemsWithinRegion = (): string[][][] => {
        let parentItem  = document.getElementById(this.CANVAS_WRAP_ID);
        if (parentItem == null) {
            throw "Could not find DOM element with ID: " + this.CANVAS_WRAP_ID;
        }
        let listOfTables: string[][][] = [];
        this.rectangleCreationManager.getRectangles().forEach((rect: GridRectangle) => {
            RectangleManagerUtil.sortRectangleLines(rect);
            RectangleManagerUtil.addRectangleEndLines(rect);
            let tableRows: string[][] = this.buildTableShape(rect.horizontalPointsSelected.length, rect.verticalPointsSelected.length);
            this.buildTableRowsFromDrawnGrid(parentItem as HTMLElement, rect, tableRows);
            rect.horizontalPointsSelected.pop();
            rect.verticalPointsSelected.pop();
            listOfTables.push(tableRows);
        });
        return listOfTables;
    }

    drawRectanglesFromPayload = (rects: GridRectangle[]) => {
        rects.forEach(rect => {
            this.rectangleCreationManager.drawRectangleWithColour(rect);
            this.rectangleCreationManager.addRectangle(rect);
            this.rectangleCreationManager.drawRectGridLines(rect);
            this.rectangleCreationManager.drawRemoveTableButton(rect);
        });
    }

    clearDownGrids = () => {
        this.rectangleCreationManager.clearDownGrids();
        this.rectangleCreationManager.resetBoxProperties({} as GridRectangle, 0, 0);
    }

    private buildTableRowsFromDrawnGrid(parentItem: Node, rect: GridRectangle, tableRows: string[][]) {
        let childNodes: NodeList = parentItem.childNodes;
        if (childNodes.length > 1) {
            childNodes.forEach((childItem) =>
                this.buildTableRowsFromDrawnGrid(childItem, rect, tableRows)
            )
        } else if (childNodes.length == 1) {
            let item: HTMLElement = childNodes[0] as HTMLElement;
            let itemBoundaryInfo: DOMRect = item.getBoundingClientRect()
            let itemPositionX = itemBoundaryInfo.left - this.canvasRect.left + window.scrollX;
            let itemPositionY = itemBoundaryInfo.top - this.canvasRect.top + window.scrollY;
            if (this.isItemInsideBox(rect, item, itemPositionX, itemPositionY)) {
                this.addGridItemToTable(itemPositionX, itemPositionY, rect, tableRows, item);
            }
        }
    }

    private addGridItemToTable(itemPositionX: number, itemPositionY: number, rect: GridRectangle, tableRows: string[][], item: HTMLElement) {
        let gridPosition: [number, number] = this.findGridPosition(itemPositionX, itemPositionY,
            rect.horizontalPointsSelected, rect.verticalPointsSelected);
        let gridRowPos: number = gridPosition[0];
        let gridColPos: number = gridPosition[1];
        if (tableRows[gridRowPos] != undefined) {
            let tableItem: string = tableRows[gridRowPos][gridColPos];
            let condition: boolean = tableItem != "" && tableItem != undefined;
            tableRows[gridRowPos][gridColPos] = condition ? tableRows[gridRowPos][gridColPos] + " " + item.innerText : item.innerText;
        } else {
            tableRows[gridRowPos] = [];
        }
    }

    private buildTableShape = (totalRows: number, totalCols: number): string[][] => {
        let tableRows: string[][] = [];
        for (let row = 0; row < totalRows; row++) {
            for (let col = 0; col < totalCols; col++) {
                if (tableRows[row] != undefined) {
                    tableRows[row].push("");
                } else if (totalRows !== 0 || totalCols !== 0) {
                    tableRows[row] = [""];
                } else {
                    tableRows[row] = [];
                }
            }
        }
        return tableRows;
    };

    private findGridPosition = (itemX: number, itemY: number, horizontalLines: HorizontalLineType[],
                                verticalLines: VerticalLineType[]): [number, number] => {
        let col: number = 0;
        let row: number = 0;
        if (horizontalLines.length === 0) {
            for (let j = 0; j < verticalLines.length; j++) {
                let verticalLineXPos = verticalLines[j].startX
                if (itemX < verticalLineXPos) {
                    row = 0;
                    col = j;
                } else {
                    col++;
                }
            }
        } else if (verticalLines.length === 0) {
            for (let i = 0; i < horizontalLines.length; i++) {
                let horizontalLineYPos = horizontalLines[i].startY;
                if (itemY < horizontalLineYPos) {
                    row = i;
                    col = 0;
                } else {
                    row++;
                }
            }
        } else {
            for (let i = 0; i < horizontalLines.length; i++) {
                let horizontalLineYPos = horizontalLines[i].startY;
                for (let j = 0; j < verticalLines.length; j++) {
                    let verticalLineXPos = verticalLines[j].startX
                    if (itemX < verticalLineXPos && itemY < horizontalLineYPos) {
                        return [i, j];
                    }
                }
            }
        }
        return [row, col]
    }

    private isItemInsideBox = (rect: GridRectangle, item: HTMLElement, xBoundary: number, yBoundary: number) => {
        let itemHeightMiddlePoint = item.offsetHeight / 2;
        return xBoundary >= rect.startX &&
            xBoundary <= rect.width + rect.startX &&
            yBoundary + itemHeightMiddlePoint >= rect.startY &&
            yBoundary + itemHeightMiddlePoint <= rect.height + rect.startY;
    }

}