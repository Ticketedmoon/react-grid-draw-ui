export class RectangleCreationManager {

    drawAllDrawnRectangles = (e: MouseEvent) => {
        this.rectangles.forEach((rect: GridRectangle) => {
            this.drawFinishedRectWithCheckForMouseOnBoxBoundary(rect, e);
            rect.horizontalPointsSelected.forEach((line: HorizontalLineType) => {
                this.drawLineFromBoxBoundaryX(line);
            });
            rect.verticalPointsSelected.forEach((line: VerticalLineType) => {
                this.drawLineFromBoxBoundaryY(line);
            });
        });
    }

    drawCurrentRectangle(rect: GridRectangle, pageX: number, pageY: number) {
        rect.width = (pageX - this.canvas.offsetLeft) - rect.startX;
        rect.height = (pageY - this.canvas.offsetTop) - rect.startY;
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
    }

    private drawFinishedRectWithCheckForMouseOnBoxBoundary(rect: GridRectangle, e: MouseEvent) {
        let endBottom = rect.height + rect.startY;
        let endRight = rect.width + rect.startX;
        let mouseX = e.pageX - this.canvas.offsetLeft;
        let mouseY = e.pageY - this.canvas.offsetTop;
        let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
        let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
        if (this.isMouseOnBoundaryOfBox(mouseX, rect.startX, endRight, mouseY, rect.startY, endBottom)) {
            this.checkForCircleOnBoundary(rect, e);
        }
        this.drawCurrentRectangle(rect, boxStartPositionX, boxStartPositionY);
    }

    drawLineAtClickedGridBoundaryPosition(e: MouseEvent) {
        let startTop = this.currentRect.startY;
        let startLeft = this.currentRect.startX;
        let endBottom = this.currentRect.height + startTop;
        let endRight = this.currentRect.width + startLeft;
        let mouseX = e.pageX - this.canvas.offsetLeft;
        let mouseY = e.pageY - this.canvas.offsetTop;
        let isTouchingBoundaryStartX = Math.abs(mouseX - startLeft) < this.lineClickTolerance;
        let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < this.lineClickTolerance;
        let isTouchingBoundaryStartY = Math.abs(mouseY - startTop) < this.lineClickTolerance;
        let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < this.lineClickTolerance;
        if (isTouchingBoundaryStartX || isTouchingBoundaryEndX) {
            let line: HorizontalLineType = {
                startX: startLeft,
                startY: this.getShiftRateFromMousePosition(mouseY),
                endX: endRight
            };
            this.currentRect.horizontalPointsSelected.push(line);
            this.currentRect.undoLineList.push(true);
            this.drawLineFromBoxBoundaryX(line);
        } else if (isTouchingBoundaryStartY || isTouchingBoundaryEndY) {
            let line: VerticalLineType = {
                startX: this.getShiftRateFromMousePosition(mouseX),
                startY: startTop,
                endY: endBottom
            };
            this.currentRect.verticalPointsSelected.push(line);
            this.drawLineFromBoxBoundaryY(line);
            this.currentRect.undoLineList.push(false);
        }
    }

    drawSelectableCircleOnBoxBoundary = (mouseX: number, mouseY: number) => {
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(mouseX, mouseY, this.selectCircleSize, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawLineFromBoxBoundaryX = (line: HorizontalLineType) => {
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.endX, line.startY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawLineFromBoxBoundaryY = (line: VerticalLineType) => {
        this.ctx.fillStyle = 'red';
        this.ctx.lineWidth = this.contextLineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(line.startX, line.startY);
        this.ctx.lineTo(line.startX, line.endY);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    resetBoxProperties = (rect: GridRectangle, startX: number, startY: number) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        rect.startX = startX;
        rect.startY = startY;
    }

    private drawElementsToScreen = (e: MouseEvent) => {
        this.drawAllDrawnRectangles(e);
    }

}