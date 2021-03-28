import { RectangleCreationManager } from "./rectangleCreationManager";
export declare class RectangleBoundaryValidator {
    private canvas;
    private selectCircleSize;
    private contextLineWidth;
    private rectangleCreationManager;
    private readonly lineClickTolerance;
    private readonly circleLineShiftSize;
    constructor(canvas: HTMLCanvasElement, gridLineProperties: ReactGridDrawLineRequiredProperties, rectangleCreationManager: RectangleCreationManager);
    getRectForMouseOnBorder(mouseX: number, mouseY: number, rectangles: GridRectangle[]): GridRectangle | undefined;
    isMouseClickInsideBoxRegion: (mouseX: number, mouseY: number, rectangles: GridRectangle[]) => boolean;
    CheckForMouseOnBoxBoundaryOfRectAndReDraw(rect: GridRectangle, mouseX: number, mouseY: number, e: MouseEvent): void;
    checkForCircleOnBoundary: (rect: GridRectangle, mouseX: number, mouseY: number) => void;
    showMouseCursorAsPointer(e: MouseEvent, pointerType: string): void;
    private previewCircleAndLineForBottomBorderOnHover;
    private previewCircleAndLineForTopBorderOnHover;
    private previewCircleAndLineForRightBorderOnHover;
    private previewCircleAndLineForLeftBorderOnHover;
    private checkForMouseOnBorderOfSingleRect;
}
