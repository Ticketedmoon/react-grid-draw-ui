export class GridOutputManager {

    private containerID: string | null = null;
    private currentRect: GridRectangle;
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement, currentRect: GridRectangle) {
        this.canvas = canvas;
        this.currentRect = currentRect;
    }

    getItemsWithinRegion = () => {
        let parentItem = document.getElementById(this.containerID as string);
        this.currentRect.horizontalPointsSelected.sort(function (a, b) {
            return a.startY - b.startY;
        });
        this.currentRect.verticalPointsSelected.sort(function (a, b) {
            return a.startX - b.startX;
        });

        let tableRows: string[][] = this.buildTableFromBox(this.currentRect.verticalPointsSelected.length, this.currentRect.horizontalPointsSelected.length);
        this.currentRect.horizontalPointsSelected.push({startX: this.currentRect.startX, startY: this.currentRect.startY + this.currentRect.height, endX: this.currentRect.startX + this.currentRect.width});
        this.currentRect.verticalPointsSelected.push({startX: this.currentRect.startX + this.currentRect.width, startY: this.currentRect.startY, endY: this.currentRect.startY + this.currentRect.height});

        if (parentItem != null) {
            let divItems: NodeList = parentItem.childNodes;
            for (let i = 0; i < divItems.length; i++) {
                let spanItems: NodeList = divItems[i].childNodes;
                for (let j = 0; j < spanItems.length; j++) {
                    let item: HTMLElement = spanItems[j] as HTMLElement;
                    let itemBoundaryInfo: DOMRect = item.getBoundingClientRect()
                    let itemPositionX = itemBoundaryInfo.x - this.canvas.offsetLeft;
                    let itemPositionY = itemBoundaryInfo.y + this.canvas.offsetTop + window.scrollY;
                    if (this.isItemInsideBox(itemPositionX, itemPositionY)) {
                        let gridPosition: [number, number] = this.findGridPosition(itemPositionX, itemPositionY,
                            this.currentRect.horizontalPointsSelected, this.currentRect.verticalPointsSelected);
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
        this.currentRect.horizontalPointsSelected.pop();
        this.currentRect.verticalPointsSelected.pop();
        return tableRows;
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

    isItemInsideBox = (xBoundary: number, yBoundary: number) => {
        return xBoundary >= this.currentRect.startX &&
            xBoundary <= this.currentRect.width + this.currentRect.startX &&
            yBoundary >= this.currentRect.startY &&
            yBoundary <= this.currentRect.height + this.currentRect.startY;
    }

}