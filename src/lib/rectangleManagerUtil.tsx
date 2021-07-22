export class RectangleManagerUtil {

    static getShiftRateFromMousePosition = (mousePos: number, circleLineShiftSize: number) => {
        return Math.round(mousePos / circleLineShiftSize) * circleLineShiftSize;
    }

    static addRectangleEndLines(rect: GridRectangle) {
        rect.horizontalPointsSelected.push({
            startX: rect.startX,
            startY: rect.startY + rect.height,
            endX: rect.startX + rect.width,
            colour: rect.colour as string
        });
        rect.verticalPointsSelected.push({
            startX: rect.startX + rect.width,
            startY: rect.startY,
            endY: rect.startY + rect.height,
            colour: rect.colour as string
        });
    }

    static sortRectangleLines(rect: GridRectangle) {
        rect.horizontalPointsSelected.sort(function (a, b) {
            return a.startY - b.startY;
        });
        rect.verticalPointsSelected.sort(function (a, b) {
            return a.startX - b.startX;
        });
    }
}