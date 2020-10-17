export class GridFunctionManager {
    undoLastDrawnLine = () => {
        let isLastLineHorizontal = this.currentRect.undoLineList.pop();
        if (isLastLineHorizontal) {
            this.currentRect.horizontalPointsSelected.pop();
        } else {
            this.currentRect.verticalPointsSelected.pop();
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let boxStartPositionX = this.currentRect.startX + this.currentRect.width + this.canvas.offsetLeft;
        let boxStartPositionY = this.currentRect.startY + this.currentRect.height + this.canvas.offsetTop;
        this.drawCurrentRectangle(this.currentRect, boxStartPositionX, boxStartPositionY);
    }
}