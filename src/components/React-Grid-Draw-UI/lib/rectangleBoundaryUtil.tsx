export class RectangleBoundaryUtil {
    static getShiftRateFromMousePosition = (mousePos: number, circleLineShiftSize: number) => {
        return Math.round(mousePos / circleLineShiftSize) * circleLineShiftSize;
    }
}