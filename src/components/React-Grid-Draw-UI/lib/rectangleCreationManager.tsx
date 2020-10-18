import {RectangleBoundaryUtil} from "./rectangleBoundaryUtil";

export class RectangleCreationManager {

    private readonly currentRect: GridRectangle;
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    private readonly lineClickTolerance: number;
    private readonly selectCircleSize: number;
    private readonly contextLineWidth: number
    private readonly circleLineShiftSize: number;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, currentRect: GridRectangle,
                gridLineProperties: ReactGridDrawLineRequiredProperties) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.currentRect = currentRect;
        this.lineClickTolerance = gridLineProperties.lineClickTolerance;
        this.selectCircleSize = gridLineProperties.selectCircleSize;
        this.contextLineWidth = gridLineProperties.contextLineWidth;
        this.circleLineShiftSize = gridLineProperties.circleLineShiftSize;
    }

    drawCurrentRectangle(rect: GridRectangle, pageX: number, pageY: number) {
        rect.width = (pageX - this.canvas.offsetLeft) - rect.startX;
        rect.height = (pageY - this.canvas.offsetTop) - rect.startY;
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
    }

    drawLineAtClickedGridBoundaryPosition(e: MouseEvent, rect: GridRectangle) {
        let startTop = rect.startY;
        let startLeft = rect.startX;
        let endBottom = rect.height + startTop;
        let endRight = rect.width + startLeft;
        let mouseX = e.pageX - this.canvas.offsetLeft;
        let mouseY = e.pageY - this.canvas.offsetTop;
        let isTouchingBoundaryStartX = Math.abs(mouseX - startLeft) < this.lineClickTolerance;
        let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < this.lineClickTolerance;
        let isTouchingBoundaryStartY = Math.abs(mouseY - startTop) < this.lineClickTolerance;
        let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < this.lineClickTolerance;

        // TODO: REFACTOR THIS INTO PRIVATE METHOD
        if (isTouchingBoundaryStartX || isTouchingBoundaryEndX) {
            let line: HorizontalLineType = {
                startX: startLeft,
                startY: RectangleBoundaryUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize),
                endX: endRight
            };
            rect.horizontalPointsSelected.push(line);
            rect.undoLineList.push(true);
            this.drawLineFromBoxBoundaryX(line);
        } else if (isTouchingBoundaryStartY || isTouchingBoundaryEndY) {
            let line: VerticalLineType = {
                startX: RectangleBoundaryUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize),
                startY: startTop,
                endY: endBottom
            };
            rect.verticalPointsSelected.push(line);
            this.drawLineFromBoxBoundaryY(line);
            rect.undoLineList.push(false);
        }
    }

    drawRectGridLines(rect: GridRectangle) {
        rect.horizontalPointsSelected.forEach((line: HorizontalLineType) => {
            this.drawLineFromBoxBoundaryX(line);
        });
        rect.verticalPointsSelected.forEach((line: VerticalLineType) => {
            this.drawLineFromBoxBoundaryY(line);
        });
    }

    drawSelectableCircleOnBoxBoundary = (mouseX: number, mouseY: number) => {
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(mouseX, mouseY, this.selectCircleSize, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawLineFromBoxBoundaryX = (line: HorizontalLineType) => {
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.endX, line.startY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawLineFromBoxBoundaryY = (line: VerticalLineType) => {
        this.ctx.fillStyle = 'red';
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