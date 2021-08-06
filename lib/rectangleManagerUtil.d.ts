import { GridRectangle } from "../types/grid.rectangle.type";
export declare class RectangleManagerUtil {
    static getShiftRateFromMousePosition: (mousePos: number, circleLineShiftSize: number) => number;
    static addRectangleEndLines(rect: GridRectangle): void;
    static sortRectangleLines(rect: GridRectangle): void;
}
