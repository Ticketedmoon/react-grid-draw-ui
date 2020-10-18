import {RectangleCreationManager} from "./rectangleCreationManager";

export class PublicFunctionManager {

    private canvas: HTMLCanvasElement;

    private readonly containerID: string | null = null;
    private readonly rectangleCreationManager: RectangleCreationManager;
    private readonly rectangles: GridRectangle[];

    constructor(canvas: HTMLCanvasElement, rectangles: GridRectangle[], containerID: string, rectangleCreationManager: RectangleCreationManager) {
        this.canvas = canvas;
        this.rectangles = rectangles;
        this.containerID = containerID;
        this.rectangleCreationManager = rectangleCreationManager;
    }

    // TODO refactor this method
    getItemsWithinRegion = (): string[][][] => {
        let parentItem = document.getElementById(this.containerID as string);
        let listOfTables: string[][][] = [];
        this.rectangles.forEach((rect: GridRectangle) => {
            rect.horizontalPointsSelected.sort(function (a, b) {
                return a.startY - b.startY;
            });
            rect.verticalPointsSelected.sort(function (a, b) {
                return a.startX - b.startX;
            });

            let tableRows: string[][] = this.buildTableFromBox(rect.verticalPointsSelected.length, rect.horizontalPointsSelected.length);
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

            if (parentItem != null) {
                let divItems: NodeList = parentItem.childNodes;
                for (let i = 0; i < divItems.length; i++) {
                    let spanItems: NodeList = divItems[i].childNodes;
                    for (let j = 0; j < spanItems.length; j++) {
                        let item: HTMLElement = spanItems[j] as HTMLElement;
                        let itemBoundaryInfo: DOMRect = item.getBoundingClientRect()
                        let itemPositionX = itemBoundaryInfo.x - this.canvas.offsetLeft;
                        let itemPositionY = itemBoundaryInfo.y + this.canvas.offsetTop + window.scrollY;
                        if (this.isItemInsideBox(rect, itemPositionX, itemPositionY)) {
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
                    }
                }
            }
            rect.horizontalPointsSelected.pop();
            rect.verticalPointsSelected.pop();
            listOfTables.push(tableRows);
        });
        return listOfTables;
    }

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

    private isItemInsideBox = (rect: GridRectangle, xBoundary: number, yBoundary: number) => {
        return xBoundary >= rect.startX &&
            xBoundary <= rect.width + rect.startX &&
            yBoundary >= rect.startY &&
            yBoundary <= rect.height + rect.startY;
    }

}