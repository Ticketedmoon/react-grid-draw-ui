import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleManagerUtil} from "./rectangleManagerUtil";

export class RectangleBoundaryValidator {

    private canvas: HTMLCanvasElement;
    private selectCircleSize: number;
    private contextLineWidth: number;
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

    isMouseClickInsideBoxRegion = (mouseX: number, mouseY: number, rectangles: GridRectangle[]): boolean => {
        return rectangles.some((rect: GridRectangle) => {
            return Math.abs(mouseX) >= rect.startX &&
                Math.abs(mouseX) <= rect.width + rect.startX &&
                Math.abs(mouseY) >= rect.startY &&
                Math.abs(mouseY) <= rect.height + rect.startY;
        });
    }

    CheckForMouseOnBoxBoundaryOfRectAndReDraw(rect: GridRectangle, mouseX: number, mouseY: number, e: MouseEvent) {
        let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
        let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
        let isTouchingRectBoundary: boolean = this.checkForMouseOnBorderOfSingleRect(rect, mouseX, mouseY);
        if (isTouchingRectBoundary) {
            this.showMouseCursorAsPointer(e, "pointer");
            this.showCircleAndLineForMouseHoverOnBoundary(rect, mouseX, mouseY);
        }
        this.rectangleCreationManager.drawRectangleFromMouse(rect, boxStartPositionX, boxStartPositionY);
    }

    showCircleAndLineForMouseHoverOnBoundary = (rect: GridRectangle, mouseX: number, mouseY: number) => {
        let startTop = rect.startY;
        let startLeft = rect.startX;
        let endBottom = rect.height + startTop;
        let endRight = rect.width + startLeft;
        let isTouchingBoundaryStartX = Math.abs(mouseX - startLeft) < this.lineClickTolerance;
        let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < this.lineClickTolerance;
        let isTouchingBoundaryStartY = Math.abs(mouseY - startTop) < this.lineClickTolerance;
        let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < this.lineClickTolerance;
        if (isTouchingBoundaryStartX && mouseY > rect.startY && mouseY <= rect.startY + rect.height) {
            this.previewCircleAndLineForLeftBorderOnHover(mouseY, startLeft, endRight, rect.colour as string);
        } else if (isTouchingBoundaryEndX && mouseY > rect.startY && mouseY <= rect.startY + rect.height) {
            this.previewCircleAndLineForRightBorderOnHover(mouseY, startLeft, endRight, rect.colour as string);
        } else if (isTouchingBoundaryStartY && mouseX > rect.startX && mouseX <= rect.startX + rect.width) {
            this.previewCircleAndLineForTopBorderOnHover(mouseX, startTop, endBottom, rect.colour as string);
        } else if (isTouchingBoundaryEndY && mouseX > rect.startX && mouseX <= rect.startX + rect.width) {
            this.previewCircleAndLineForBottomBorderOnHover(mouseX, endBottom, startTop, rect.colour as string);
        }
    }

    showMouseCursorAsPointer(e: MouseEvent, pointerType: string) {
        let target: HTMLCanvasElement = e.target as HTMLCanvasElement;
        target.style.cursor = pointerType;
    }

    private previewCircleAndLineForBottomBorderOnHover(mouseX: number, endBottom: number, startTop: number, lineColour: string) {
        let shiftRateFromMousePosition = RectangleManagerUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize);
        let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: endBottom, endY: startTop, colour: lineColour};

        this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, endBottom, lineColour);
        this.rectangleCreationManager.drawLineFromBoxBoundaryY(line);
    }

    private previewCircleAndLineForTopBorderOnHover(mouseX: number, startTop: number, endBottom: number, lineColour: string) {
        let shiftRateFromMousePosition = RectangleManagerUtil.getShiftRateFromMousePosition(mouseX, this.circleLineShiftSize);
        let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: startTop, endY: endBottom, colour: lineColour};
        this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, startTop, lineColour);
        this.rectangleCreationManager.drawLineFromBoxBoundaryY(line);
    }

    private previewCircleAndLineForRightBorderOnHover(mouseY: number, startLeft: number, endRight: number, lineColour: string) {
        let shiftRateFromMousePosition = RectangleManagerUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize);
        let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight, colour: lineColour};
        this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(endRight, shiftRateFromMousePosition, lineColour);
        this.rectangleCreationManager.drawLineFromBoxBoundaryX(line);
    }

    private previewCircleAndLineForLeftBorderOnHover(mouseY: number, startLeft: number, endRight: number, lineColour: string) {
        let shiftRateFromMousePosition = RectangleManagerUtil.getShiftRateFromMousePosition(mouseY, this.circleLineShiftSize);
        let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight, colour: lineColour};
        this.rectangleCreationManager.drawSelectableCircleOnBoxBoundary(startLeft, shiftRateFromMousePosition, lineColour);
        this.rectangleCreationManager.drawLineFromBoxBoundaryX(line);
    }

    private checkForMouseOnBorderOfSingleRect(rect: GridRectangle, mouseX: number, mouseY: number) {
        let startTop = rect.startY;
        let startLeft = rect.startX;
        let endBottom = rect.height + startTop;
        let endRight = rect.width + startLeft;

        let isTouchingBoundaryX: boolean = Math.abs(mouseX - startLeft) <= this.lineClickTolerance || Math.abs(mouseX - endRight) <= this.lineClickTolerance;
        let isTouchingBoundaryY: boolean = Math.abs(mouseY - startTop) <= this.lineClickTolerance || Math.abs(mouseY - endBottom) <= this.lineClickTolerance;
        let isWithinXBoundaryOfBox: boolean = mouseX >= startLeft && mouseX <= endRight;
        let isWithinYBoundaryOfBox: boolean = mouseY >= startTop && mouseY <= endBottom;
        return (isTouchingBoundaryX && isWithinYBoundaryOfBox) || (isTouchingBoundaryY && isWithinXBoundaryOfBox);
    }
}