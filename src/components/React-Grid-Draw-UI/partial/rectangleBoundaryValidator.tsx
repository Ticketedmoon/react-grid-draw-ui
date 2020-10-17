export class RectangleBoundaryValidator {

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
            let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseY);
            let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
            this.drawSelectableCircleOnBoxBoundary(startLeft, shiftRateFromMousePosition);
            this.drawLineFromBoxBoundaryX(line);
        } else if (isTouchingBoundaryEndX && mouseY > rect.startY && mouseY < rect.startY + rect.height) {
            let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseY);
            let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
            this.drawSelectableCircleOnBoxBoundary(endRight, shiftRateFromMousePosition);
            this.drawLineFromBoxBoundaryX(line);
        } else if (isTouchingBoundaryStartY && mouseX > rect.startX && mouseX < rect.startX + rect.width) {
            let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseX);
            let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: startTop, endY: endBottom};
            this.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, startTop);
            this.drawLineFromBoxBoundaryY(line);
        } else if (isTouchingBoundaryEndY && mouseX > rect.startX && mouseX < rect.startX + rect.width) {
            let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseX);
            let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: endBottom, endY: startTop};
            this.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, endBottom);
            this.drawLineFromBoxBoundaryY(line);
        }
    }

    getShiftRateFromMousePosition = (mousePos: number) => {
        return Math.round(mousePos / this.circleLineShiftSize) * this.circleLineShiftSize;
    }
}