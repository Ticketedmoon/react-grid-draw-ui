import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleManagerUtil} from "./rectangleManagerUtil";
import {ReactGridDrawLineRequiredProperties} from "../types/react.grid.line.properties.type";
import {GridRectangle} from "../types/grid.rectangle.type";
import {VerticalLineType} from "../types/vertical.line.type";
import {HorizontalLineType} from "../types/horizontal.line.type";

export class RectangleBoundaryValidator {

    private readonly NO_INDEX_FOUND: number = -1;

    private canvas: HTMLCanvasElement;
    private selectCircleSize: number;
    private contextLineWidth: number;
    private rectangleCreationManager: RectangleCreationManager;
    private readonly lineClickTolerance: number;
    private readonly circleLineShiftSize: number;
    private lineDeletionModeActive: boolean = false;

    constructor(canvas: HTMLCanvasElement, gridLineProperties: ReactGridDrawLineRequiredProperties,
                rectangleCreationManager: RectangleCreationManager) {
        this.canvas = canvas;
        this.lineClickTolerance = gridLineProperties.lineClickTolerance;
        this.selectCircleSize = gridLineProperties.selectCircleSize;
        this.circleLineShiftSize = gridLineProperties.circleLineShiftSize;
        this.contextLineWidth = gridLineProperties.contextLineWidth;
        this.rectangleCreationManager = rectangleCreationManager;
    }

    deleteGridWhenRemoveButtonClicked(mouseX: number, mouseY: number): boolean {
        let gridWasDeleted: boolean = false;
        this.rectangleCreationManager.getRectangles().forEach((rect: GridRectangle, index: number) => {
            if (this.isMouseOnRemoveGridButton(rect, mouseX, mouseY)) {
                this.rectangleCreationManager.removeRectangle(index);
                gridWasDeleted = true;
            }
        });
        return gridWasDeleted;
    }

    isMouseOnRemoveButtonForAnyGrid(mouseX: number, mouseY: number): boolean {
        let isMouseOnRemoveButtonForAnyGrid: boolean = false;
        this.rectangleCreationManager.getRectangles().forEach((rect: GridRectangle) => {
            if (this.isMouseOnRemoveGridButton(rect, mouseX, mouseY)) {
                isMouseOnRemoveButtonForAnyGrid = true;
            }
        });
        return isMouseOnRemoveButtonForAnyGrid;
    }

    getRectForMouseOnBorder(mouseX: number, mouseY: number): GridRectangle | undefined {
        return this.rectangleCreationManager.getRectangles().find((rect: GridRectangle) => {
            return this.checkForMouseOnBorderOfGrid(rect, mouseX, mouseY);
        });
    }

    getGridWhenMouseClickInsideGridRegion = (mouseX: number, mouseY: number): GridRectangle | undefined => {
        return this.rectangleCreationManager.getRectangles().find((rect: GridRectangle) => {
            return Math.abs(mouseX) >= rect.startX &&
                Math.abs(mouseX) <= rect.width + rect.startX &&
                Math.abs(mouseY) >= rect.startY &&
                Math.abs(mouseY) <= rect.height + rect.startY;
        });
    }

    checkForMouseHoverOnGrid(rect: GridRectangle, mouseX: number, mouseY: number, e: MouseEvent) {
        let isTouchingGridBorder: boolean = this.checkForMouseOnBorderOfGrid(rect, mouseX, mouseY);
        if (isTouchingGridBorder) {
            this.showMouseCursorAsPointer(e, "pointer");
            this.showCircleAndLineForMouseHoverOnBoundary(rect, mouseX, mouseY);
        } else if (this.isMouseOnRemoveGridButton(rect, mouseX, mouseY)) {
            this.showMouseCursorAsPointer(e, "pointer");
        } else {
            let horizontalLineFromHover: number = this.findHorizontalLineIndexInGridFromMousePosition(rect, mouseX, mouseY);
            let verticalLineFromHover: number = this.findVerticalLineIndexInGridFromMousePosition(rect, mouseX, mouseY);
            if (horizontalLineFromHover != this.NO_INDEX_FOUND || verticalLineFromHover != this.NO_INDEX_FOUND) {
                this.handleDeletionModeHoverAction(rect, horizontalLineFromHover, verticalLineFromHover, e);
            } else {
                this.repaintLinesGridColouration(rect);
            }
        }
    }

    private repaintLinesGridColouration(rect: GridRectangle) {
        rect.horizontalPointsSelected.forEach(line => line.colour = rect.colour as string);
        rect.verticalPointsSelected.forEach(line => line.colour = rect.colour as string);
    }

    private handleDeletionModeHoverAction(rect: GridRectangle, horizontalLineIndexFromHover: number,
                                          verticalLineIndexFromHover: number, e: MouseEvent) {
        if (this.lineDeletionModeActive) {
            if (horizontalLineIndexFromHover != this.NO_INDEX_FOUND) {
                let horizontalLine: HorizontalLineType = rect.horizontalPointsSelected[horizontalLineIndexFromHover];
                horizontalLine.colour = "#FF0000";
            } else if (verticalLineIndexFromHover != this.NO_INDEX_FOUND) {
                let verticalLine: VerticalLineType = rect.verticalPointsSelected[verticalLineIndexFromHover];
                verticalLine.colour = "#FF0000";
            }
            this.showMouseCursorAsPointer(e, "pointer");
        } else {
            this.showMouseCursorAsPointer(e, "grab");
        }
    }

    findHorizontalLineIndexInGridFromMousePosition = (rect: GridRectangle, mouseX: number, mouseY: number): number => {
        return rect.horizontalPointsSelected.findIndex((line: HorizontalLineType) => {
            let isWithinLineWidth: boolean = mouseX > line.startX && mouseX < line.endX;
            let isMouseHoverOnLineYAxis = Math.abs(mouseY - line.startY) < 5;
            return isWithinLineWidth && isMouseHoverOnLineYAxis;
        });
    };

    findVerticalLineIndexInGridFromMousePosition = (rect: GridRectangle, mouseX: number, mouseY: number): number => {
        return rect.verticalPointsSelected.findIndex((line: VerticalLineType) => {
            let isWithinLineColumn: boolean = mouseY > line.startY && mouseY < line.endY;
            let isMouseHoverOnLineXAxis = Math.abs(mouseX - line.startX) < 5;
            return isWithinLineColumn && isMouseHoverOnLineXAxis;
        });
    };

    isMouseOnRemoveGridButton = (rect: GridRectangle, mouseX: number, mouseY: number) => {
        let removeButtonTop = rect.startY - 30;
        let removeButtonBottom = rect.startY - 5;
        let startLeft = rect.endX - 20;
        let endRight = startLeft + 20;

        if (rect.startX <= rect.endX && rect.startY <= rect.endY) {
            return mouseX >= startLeft && mouseX <= endRight && mouseY >= removeButtonTop && mouseY <= removeButtonBottom;
        } else if (rect.startX <= rect.endX && rect.startY > rect.endY) {
            return mouseX >= startLeft && mouseX <= endRight && mouseY >= rect.endY-30 && mouseY <= rect.endY-5;
        } else if (rect.startX > rect.endX && rect.startY <= rect.endY) {
            return mouseX >= rect.startX-20 && mouseX <= rect.startX+20 && mouseY >= removeButtonTop && mouseY <= removeButtonBottom;
        } else if (rect.startX > rect.endX && rect.startY > rect.endY) {
            return mouseX >= rect.startX-20 && mouseX <= rect.startX+20 && mouseY>= rect.endY-30 && mouseY <= rect.endY-5;
        }
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

    setLineDeletionMode(mode: boolean) {
        this.lineDeletionModeActive = mode;
    }

    isLineDeletionModeActive() {
        return this.lineDeletionModeActive;
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

    private checkForMouseOnBorderOfGrid(rect: GridRectangle, mouseX: number, mouseY: number) {
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