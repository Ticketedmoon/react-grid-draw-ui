import {RectangleManagerUtil} from "./rectangleManagerUtil";

export class RectangleCreationManager {

    private readonly currentRect: GridRectangle;
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private readonly lineClickTolerance: number;
    private readonly selectCircleSize: number;
    private readonly contextLineWidth: number
    private readonly circleLineShiftSize: number;
    private readonly lineColour: string;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, currentRect: GridRectangle,
                gridLineProperties: ReactGridDrawLineRequiredProperties) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentRect = currentRect;
        this.lineClickTolerance = gridLineProperties.lineClickTolerance;
        this.selectCircleSize = gridLineProperties.selectCircleSize;
        this.contextLineWidth = gridLineProperties.contextLineWidth;
        this.circleLineShiftSize = gridLineProperties.circleLineShiftSize;
        this.lineColour = gridLineProperties.lineColour;
    }

    drawRectangle(rect: GridRectangle, mouseX: number, mouseY: number) {
        rect.width = (mouseX - this.canvas.offsetLeft) - rect.startX;
        rect.height = (mouseY - this.canvas.offsetTop) - rect.startY;
        this.ctx.strokeStyle = this.lineColour;
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
    }

    drawLineAtClickedGridBoundaryPosition(e: MouseEvent, rect: GridRectangle) {
        let endBottom = rect.height + rect.startY;
        let endRight = rect.width + rect.startX;
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;
        let isTouchingBoundaryStartX = Math.abs(mouseX - rect.startX) < this.lineClickTolerance;
        let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < this.lineClickTolerance;
        let isTouchingBoundaryStartY = Math.abs(mouseY - rect.startY) < this.lineClickTolerance;
        let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < this.lineClickTolerance;

        if (isTouchingBoundaryStartX || isTouchingBoundaryEndX) {
            this.addHorizontalLineAtMousePosition(rect.startX, mouseY, endRight, rect);
        } else if (isTouchingBoundaryStartY || isTouchingBoundaryEndY) {
            this.addVerticalLineAtMousePosition(mouseX, rect.startY, endBottom, rect);
        }
    }

    private addVerticalLineAtMousePosition(mouseX: number, startTop: number, endBottom: number, rect: GridRectangle) {
        let line: VerticalLineType = {
            startX: RectangleManagerUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize),
            startY: startTop,
            endY: endBottom
        };
        rect.verticalPointsSelected.push(line);
        this.drawLineFromBoxBoundaryY(line);
        rect.undoLineList.push(false);
    }

    private addHorizontalLineAtMousePosition(startLeft: number, mouseY: number, endRight: number, rect: GridRectangle) {
        let line: HorizontalLineType = {
            startX: startLeft,
            startY: RectangleManagerUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize),
            endX: endRight
        };
        rect.horizontalPointsSelected.push(line);
        rect.undoLineList.push(true);
        this.drawLineFromBoxBoundaryX(line);
    }

    drawAllRectBorderLinesAndGridLines = (rectangles: GridRectangle[]) => {
        rectangles.forEach((rect: GridRectangle) => {
            let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
            let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
            this.drawRectangle(rect, boxStartPositionX, boxStartPositionY);
            this.drawRectGridLines(rect);
        });
    };

    drawRectGridLines(rect: GridRectangle) {
        rect.horizontalPointsSelected.forEach((line: HorizontalLineType) => {
            this.drawLineFromBoxBoundaryX(line);
        });
        rect.verticalPointsSelected.forEach((line: VerticalLineType) => {
            this.drawLineFromBoxBoundaryY(line);
        });
    }

    drawSelectableCircleOnBoxBoundary = (mouseX: number, mouseY: number) => {
        this.ctx.fillStyle = this.lineColour;
        this.ctx.beginPath();
        this.ctx.arc(mouseX, mouseY, this.selectCircleSize, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawLineFromBoxBoundaryX = (line: HorizontalLineType) => {
        this.ctx.fillStyle = this.lineColour;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.endX, line.startY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawLineFromBoxBoundaryY = (line: VerticalLineType) => {
        this.ctx.fillStyle = this.lineColour;
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.startX, line.endY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    resetBoxProperties = (rect: GridRectangle, startX: number, startY: number) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        rect.startX = startX;
        rect.startY = startY;
    }
}