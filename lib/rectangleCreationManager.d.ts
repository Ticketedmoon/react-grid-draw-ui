export declare class RectangleCreationManager {
    private readonly currentRect;
    private ctx;
    private canvas;
    private readonly lineClickTolerance;
    private readonly selectCircleSize;
    private readonly contextLineWidth;
    private readonly circleLineShiftSize;
    private readonly lineColour;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, currentRect: GridRectangle, gridLineProperties: ReactGridDrawLineRequiredProperties);
    drawRectangle(rect: GridRectangle, mouseX: number, mouseY: number): void;
    drawLineAtClickedGridBoundaryPosition(e: MouseEvent, rect: GridRectangle): void;
    private addVerticalLineAtMousePosition;
    private addHorizontalLineAtMousePosition;
    drawAllRectBorderLinesAndGridLines: (rectangles: GridRectangle[]) => void;
    drawRectGridLines(rect: GridRectangle): void;
    drawSelectableCircleOnBoxBoundary: (mouseX: number, mouseY: number) => void;
    drawLineFromBoxBoundaryX: (line: HorizontalLineType) => void;
    drawLineFromBoxBoundaryY: (line: VerticalLineType) => void;
    resetBoxProperties: (rect: GridRectangle, startX: number, startY: number) => void;
}
