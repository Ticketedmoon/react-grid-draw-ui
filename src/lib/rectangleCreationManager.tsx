import {RectangleManagerUtil} from "./rectangleManagerUtil";
import {ReactGridDrawLineRequiredProperties} from "../types/react.grid.line.properties.type";
import {GridRectangle} from "../types/grid.rectangle.type";
import {HorizontalLineType} from "../types/horizontal.line.type";
import {VerticalLineType} from "../types/vertical.line.type";

export class RectangleCreationManager {

    private readonly X_CHARACTER: string = "❎";

    private readonly rectangles: GridRectangle[];
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private readonly lineClickTolerance: number;
    private readonly selectCircleSize: number;
    private readonly contextLineWidth: number
    private readonly circleLineShiftSize: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, gridLineProperties: ReactGridDrawLineRequiredProperties) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lineClickTolerance = gridLineProperties.lineClickTolerance;
        this.selectCircleSize = gridLineProperties.selectCircleSize;
        this.contextLineWidth = gridLineProperties.contextLineWidth;
        this.circleLineShiftSize = gridLineProperties.circleLineShiftSize;
        this.rectangles = [];
    }

    drawRectangleFromMouse(rect: GridRectangle, mouseX: number, mouseY: number) {
        rect.width = (mouseX - this.canvas.offsetLeft) - rect.startX;
        rect.height = (mouseY - this.canvas.offsetTop) - rect.startY;
        this.drawRectangleWithColour(rect);
    }

    drawRectangleWithColour(rect: GridRectangle) {
        this.ctx.strokeStyle = rect.colour as string;
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
    }

    clearRegionFromCanvasContext(x: number, y: number, width: number, height: number) {
        this.ctx.clearRect(x, y, width, height);
    }

    drawRemoveTableButton(rect: GridRectangle) {
        this.ctx.font = '1em Roboto';
        if (rect.startX <= rect.endX && rect.startY <= rect.endY) {
            this.ctx.fillText(this.X_CHARACTER, (rect.startX + rect.width) - 20, rect.startY - 10);
        } else if (rect.startX <= rect.endX && rect.startY > rect.endY) {
            this.ctx.fillText(this.X_CHARACTER, (rect.startX + rect.width) - 20, rect.endY - 10);
        } else if (rect.startX > rect.endX && rect.startY <= rect.endY) {
            this.ctx.fillText(this.X_CHARACTER, (rect.startX) - 20, rect.startY - 10);
        } else if (rect.startX > rect.endX && rect.startY > rect.endY) {
            this.ctx.fillText(this.X_CHARACTER, (rect.startX) - 20, rect.endY - 10);
        }
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

    getRectangles() {
        return this.rectangles;
    }

    addRectangle(rect: GridRectangle) {
        this.rectangles.push(rect);
    }

    removeRectangle(index: number) {
        this.rectangles.splice(index, 1);
    }

    drawAllRectBorderLinesAndGridLines = (rectangles: GridRectangle[]) => {
        rectangles.forEach((rect: GridRectangle) => {
            let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
            let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
            this.drawRectangleFromMouse(rect, boxStartPositionX, boxStartPositionY);
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

    drawSelectableCircleOnBoxBoundary = (mouseX: number, mouseY: number, colour: string) => {
        this.ctx.fillStyle = colour;
        this.ctx.beginPath();
        this.ctx.arc(mouseX, mouseY, this.selectCircleSize, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawLineFromBoxBoundaryX = (line: HorizontalLineType) => {
        this.ctx.strokeStyle = line.colour;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.endX, line.startY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawLineFromBoxBoundaryY = (line: VerticalLineType) => {
        this.ctx.strokeStyle = line.colour;
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

    private addVerticalLineAtMousePosition(mouseX: number, startTop: number, endBottom: number, rect: GridRectangle) {
        let line: VerticalLineType = {
            startX: RectangleManagerUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize),
            startY: startTop,
            endY: endBottom,
            colour: rect.colour as string
        };
        rect.verticalPointsSelected.push(line);
        this.drawLineFromBoxBoundaryY(line);
        rect.undoLineList.push(false);
    }

    private addHorizontalLineAtMousePosition(startLeft: number, mouseY: number, endRight: number, rect: GridRectangle) {
        let line: HorizontalLineType = {
            startX: startLeft,
            startY: RectangleManagerUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize),
            endX: endRight,
            colour: rect.colour as string
        };
        rect.horizontalPointsSelected.push(line);
        rect.undoLineList.push(true);
        this.drawLineFromBoxBoundaryX(line);
    }
}