import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleBoundaryUtil} from "./rectangleBoundaryUtil";

export class RectangleBoundaryValidator {

    private canvas: HTMLCanvasElement;
    private currentRect: GridRectangle;
    private selectCircleSize: number;
    private contextLineWidth: number
    private rectangleCreationManager: RectangleCreationManager;
    private readonly lineClickTolerance: number;
    private readonly circleLineShiftSize: number;

    constructor(canvas: HTMLCanvasElement, currentRect: GridRectangle, gridLineProperties: ReactGridDrawLineRequiredProperties,
                rectangleCreationManager: RectangleCreationManager) {
        this.canvas = canvas;
        this.currentRect = currentRect;
        this.lineClickTolerance = gridLineProperties.lineClickTolerance;
        this.selectCircleSize = gridLineProperties.selectCircleSize;
        this.circleLineShiftSize = gridLineProperties.circleLineShiftSize;
        this.contextLineWidth = gridLineProperties.contextLineWidth;
        this.rectangleCreationManager = rectangleCreationManager;
    }

    isMouseOnBoundaryOfBox(mouseX: number, startLeft: number, endRight: number, mouseY: number, startTop: number, endBottom: number) {
        let isTouchingBoundaryX: boolean = Math.abs(mouseX - startLeft) < this.lineClickTolerance || Math.abs(mouseX - endRight) < this.lineClickTolerance;
        let isTouchingBoundaryY: boolean = Math.abs(mouseY - startTop) < this.lineClickTolerance || Math.abs(mouseY - endBottom) < this.lineClickTolerance;
        let isWithinXBoundaryOfBox = mouseX >= startLeft && mouseX <= endRight;
        let isWithinYBoundaryOfBox = mouseY >= startTop && mouseY <= endBottom;
        return (isTouchingBoundaryX && isWithinYBoundaryOfBox) || (isTouchingBoundaryY && isWithinXBoundaryOfBox);
    }

    isMouseClickInsideBoxRegion = (e: MouseEvent): boolean => {
        let mouseX = Math.abs(parseInt(String(e.pageX - this.canvas.offsetLeft)));
        let mouseY = Math.abs(parseInt(String(e.pageY - this.canvas.offsetTop)));
        return mouseX >= this.currentRect.startX &&
            mouseX <= this.currentRect.width + this.currentRect.startX &&
            mouseY >= this.currentRect.startY &&
            mouseY <= this.currentRect.height + this.currentRect.startY;
    }

    checkForCircleOnBoundary = (rect: GridRectangle, e: MouseEvent) => {
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
        if (isTouchingBoundaryStartX && mouseY > rect.startY && mouseY < rect.startY + rect.height) {
            let shiftRateFromMousePosition = RectangleBoundaryUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize);
            let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
            this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(startLeft, shiftRateFromMousePosition);
            this.rectangleCreationManager.drawLineFromBoxBoundaryX(line);
        } else if (isTouchingBoundaryEndX && mouseY > rect.startY && mouseY < rect.startY + rect.height) {
            let shiftRateFromMousePosition = RectangleBoundaryUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize);
            let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
            this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(endRight, shiftRateFromMousePosition);
            this.rectangleCreationManager.drawLineFromBoxBoundaryX(line);
        } else if (isTouchingBoundaryStartY && mouseX > rect.startX && mouseX < rect.startX + rect.width) {
            let shiftRateFromMousePosition = RectangleBoundaryUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize);
            let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: startTop, endY: endBottom};
            this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, startTop);
            this.rectangleCreationManager.drawLineFromBoxBoundaryY(line);
        } else if (isTouchingBoundaryEndY && mouseX > rect.startX && mouseX < rect.startX + rect.width) {
            let shiftRateFromMousePosition = RectangleBoundaryUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize);
            let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: endBottom, endY: startTop};
            this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, endBottom);
            this.rectangleCreationManager.drawLineFromBoxBoundaryY(line);
        }
    }

    CheckForMouseOnBoxBoundaryOfRectAndReDraw(rect: GridRectangle, e: MouseEvent) {
        let endBottom = rect.height + rect.startY;
        let endRight = rect.width + rect.startX;
        let mouseX = e.pageX - this.canvas.offsetLeft;
        let mouseY = e.pageY - this.canvas.offsetTop;
        let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
        let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
        if (this.isMouseOnBoundaryOfBox(mouseX, rect.startX, endRight, mouseY, rect.startY, endBottom)) {
            this.checkForCircleOnBoundary(rect, e);
        }
        this.rectangleCreationManager.drawCurrentRectangle(rect, boxStartPositionX, boxStartPositionY);
    }
}