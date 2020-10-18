import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleBoundaryUtil} from "./rectangleBoundaryUtil";

export class RectangleBoundaryValidator {

    private canvas: HTMLCanvasElement;
    private selectCircleSize: number;
    private contextLineWidth: number
    private rectangleCreationManager: RectangleCreationManager;
    private readonly lineClickTolerance: number;
    private readonly circleLineShiftSize: number;

    constructor(canvas: HTMLCanvasElement, gridLineProperties: ReactGridDrawLineRequiredProperties,
                rectangleCreationManager: RectangleCreationManager) {
        this.canvas = canvas;
        this.lineClickTolerance = gridLineProperties.lineClickTolerance;
        this.selectCircleSize = gridLineProperties.selectCircleSize;
        this.circleLineShiftSize = gridLineProperties.circleLineShiftSize;
        this.contextLineWidth = gridLineProperties.contextLineWidth;
        this.rectangleCreationManager = rectangleCreationManager;
    }

    getRectForMouseOnBorder(mouseX: number, mouseY: number, rectangles: GridRectangle[]): GridRectangle | undefined {
        return rectangles.find((rect: GridRectangle) => {
            return this.checkForMouseOnBorderOfSingleRect(rect, mouseX, mouseY);
        });
    }

    private checkForMouseOnBorderOfSingleRect(rect: GridRectangle, mouseX: number, mouseY: number) {
        let startTop = rect.startY;
        let startLeft = rect.startX;
        let endBottom = rect.height + startTop;
        let endRight = rect.width + startLeft;

        let isTouchingBoundaryX: boolean = Math.abs(mouseX - startLeft) < this.lineClickTolerance || Math.abs(mouseX - endRight) < this.lineClickTolerance;
        let isTouchingBoundaryY: boolean = Math.abs(mouseY - startTop) < this.lineClickTolerance || Math.abs(mouseY - endBottom) < this.lineClickTolerance;
        let isWithinXBoundaryOfBox: boolean = mouseX >= startLeft && mouseX <= endRight;
        let isWithinYBoundaryOfBox: boolean = mouseY >= startTop && mouseY <= endBottom;
        return (isTouchingBoundaryX && isWithinYBoundaryOfBox) || (isTouchingBoundaryY && isWithinXBoundaryOfBox);
    }

    isMouseClickInsideBoxRegion = (e: MouseEvent, rectangles: GridRectangle[]): boolean => {
        let mouseX = Math.abs(parseInt(String(e.pageX - this.canvas.offsetLeft)));
        let mouseY = Math.abs(parseInt(String(e.pageY - this.canvas.offsetTop)));
        return rectangles.some((rect: GridRectangle) => {
            return mouseX >= rect.startX &&
                mouseX <= rect.width + rect.startX &&
                mouseY >= rect.startY &&
                mouseY <= rect.height + rect.startY;
        });
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
        // TODO: refactor each conditional body into private method
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
        let mouseX = e.pageX - this.canvas.offsetLeft;
        let mouseY = e.pageY - this.canvas.offsetTop;
        let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
        let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
        let isTouchingRectBoundary: boolean = this.checkForMouseOnBorderOfSingleRect(rect, mouseX, mouseY);
        if (isTouchingRectBoundary) {
            this.checkForCircleOnBoundary(rect, e);
        }
        this.rectangleCreationManager.drawCurrentRectangle(rect, boxStartPositionX, boxStartPositionY);
    }
}