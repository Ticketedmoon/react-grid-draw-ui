import {RectangleCreationManager} from "./rectangleCreationManager";

export class PublicFunctionManager {

    private readonly CANVAS_WRAP_ID: string = "canvas-wrap";

    private canvas: HTMLCanvasElement;

    private readonly rectangleCreationManager: RectangleCreationManager;
    private readonly rectangles: GridRectangle[];
    private readonly canvasRect: DOMRect;

    constructor(canvas: HTMLCanvasElement, rectangles: GridRectangle[], rectangleCreationManager: RectangleCreationManager) {
        this.canvas = canvas;
        this.rectangles = rectangles;
        this.rectangleCreationManager = rectangleCreationManager;
        this.canvasRect = this.canvas.getBoundingClientRect();
    }

    getItemsWithinRegion = (): string[][][] => {
        let parentItem  = document.getElementById(this.CANVAS_WRAP_ID);
        if (parentItem == null) {
            throw "Could not find DOM element with ID: " + this.CANVAS_WRAP_ID;
        }
        let listOfTables: string[][][] = [];
        this.rectangles.forEach((rect: GridRectangle) => {
            PublicFunctionManager.sortRectangleLines(rect);
            //PublicFunctionManager.addRectangleEndLines(rect);
            let tableRows: string[][] = this.buildTableFromBox(rect.verticalPointsSelected.length, rect.horizontalPointsSelected.length);
            this.buildTableRowsFromDrawnGrid(parentItem as HTMLElement, rect, tableRows);
/*
            rect.horizontalPointsSelected.pop();
            rect.verticalPointsSelected.pop();
*/
            listOfTables.push(tableRows);
        });
        return listOfTables;
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

    private static addRectangleEndLines(rect: GridRectangle) {
        rect.horizontalPointsSelected.push({
            startX: rect.startX,
            startY: rect.startY + rect.height,
            endX: rect.startX + rect.width
        });
        rect.verticalPointsSelected.push({
            startX: rect.startX + rect.width,
            startY: rect.startY,
            endY: rect.startY + rect.height
        });
    }

    private static sortRectangleLines(rect: GridRectangle) {
        rect.horizontalPointsSelected.sort(function (a, b) {
            return a.startY - b.startY;
        });
        rect.verticalPointsSelected.sort(function (a, b) {
            return a.startX - b.startX;
        });
    }

    undoLastRectangle = () => {
        this.rectangles.pop();
        this.rectangleCreationManager.resetBoxProperties({} as GridRectangle, 0, 0);
        this.rectangleCreationManager.drawAllRectBorderLinesAndGridLines(this.rectangles);
    };

    undoLastDrawnLineForLatestRectangle = () => {
        // TODO: change hard-coded index to be a int parameter that user can choose - so if they choose the 2th-index rectangle
        //  We will remove lines from that rectangle.
        let rect: GridRectangle = this.rectangles[this.rectangles.length-1];
        this.undoLastDrawnLineForRectangle(rect);
    }

    private undoLastDrawnLineForRectangle = (rect: GridRectangle) => {
        let isLastLineHorizontal = rect.undoLineList.pop();
        if (isLastLineHorizontal) {
            rect.horizontalPointsSelected.pop();
        } else {
            rect.verticalPointsSelected.pop();
        }
        let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
        let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
        this.rectangleCreationManager.resetBoxProperties(rect, rect.startX, rect.startY);
        this.rectangleCreationManager.drawRectangle(rect, boxStartPositionX, boxStartPositionY);
        this.rectangleCreationManager.drawAllRectBorderLinesAndGridLines(this.rectangles);
    }

    private buildTableFromBox = (totalCols: number, totalRows: number) => {
        let tableRows: string[][] = [];
        for (let row = 0; row < totalRows + 1; row++) {
            for (let col = 0; col < totalCols + 1; col++) {
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