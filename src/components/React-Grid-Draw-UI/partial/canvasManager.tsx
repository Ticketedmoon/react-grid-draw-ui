export class CanvasManager {

	canvas: any;
	ctx: any;
	drag: boolean = false;
	body: HTMLElement | null = null;
	containerID: string | null = null;

	lineClickTolerance: number;
	selectCircleSize: number;
	circleLineShiftSize: number;
	contextLineWidth: number

	currentRect: GridRectangle;
	rectangles: GridRectangle[];

	constructor(lineProperties: ReactGridDrawLineRequiredProperties) {
		this.lineClickTolerance = lineProperties.lineClickTolerance;
		this.selectCircleSize = lineProperties.selectCircleSize;
		this.circleLineShiftSize = lineProperties.circleLineShiftSize;
		this.contextLineWidth = lineProperties.contextLineWidth;
		this.rectangles = [];
		this.currentRect = {startX: 0, startY: 0, height: 0, width: 0, horizontalPointsSelected: [], verticalPointsSelected: [], undoLineList: []};
	}

	createCanvas = (containerID: string) => {
		this.containerID = containerID;
		this.canvas = document.getElementById('canvas');
		this.body = document.getElementById(this.containerID);
		this.ctx = this.canvas.getContext('2d');
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		this.setCanvasSize();
	}

	setCanvasSize = () => {
		if (this.body != null) {
			this.canvas.width = this.body.offsetWidth;
			this.canvas.height = this.body.offsetHeight;
		}
	}

	resetBoxProperties = (rect: GridRectangle, startX: number, startY: number) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		rect.startX = startX;
		rect.startY = startY;
	}

	mouseDown = (e: MouseEvent) => {
		let startTop = this.currentRect.startY;
		let startLeft = this.currentRect.startX;
		let endBottom = this.currentRect.height + startTop;
		let endRight = this.currentRect.width + startLeft;
		let mouseX = e.offsetX;
		let mouseY = e.offsetY - this.canvas.offsetTop;

		if (this.isMouseOnBoundaryOfBox(mouseX, startLeft, endRight, mouseY, startTop, endBottom)) {
			this.drawLineAtClickedGridBoundaryPosition(e);
		} else if (!this.isMouseClickInsideBoxRegion(e)) {
			this.resetBoxProperties(this.currentRect, mouseX, mouseY);
			this.drag = true;
		}
	}

	mouseUp = (e: MouseEvent) => {
		this.drag = false;
		this.rectangles.push(this.currentRect);
		this.currentRect = {startX: 0, startY: 0, width: 0, height: 0, verticalPointsSelected: [], horizontalPointsSelected: [], undoLineList: []}
		this.drawAllDrawnRectangles(e);
	}

	mouseMove = (e: MouseEvent) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.drag && this.body != null) {
			this.drawCurrentRectangle(this.currentRect, e.pageX, e.pageY);
		} else if (!this.drag) {
			this.drawFinishedRectWithCheckForMouseOnBoxBoundary(this.currentRect, e);
		}
		this.drawElementsToScreen(e);
	}

	private drawElementsToScreen = (e: MouseEvent) => {
		this.drawAllDrawnRectangles(e);
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

	drawCurrentRectangle(rect: GridRectangle, pageX: number, pageY: number) {
		rect.width = (pageX - this.canvas.offsetLeft) - rect.startX;
		rect.height = (pageY - this.canvas.offsetTop) - rect.startY;
		this.ctx.strokeStyle = 'red';
		this.ctx.lineWidth = this.contextLineWidth;
		this.ctx.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
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

	isItemInsideBox = (xBoundary: number, yBoundary: number) => {
		return xBoundary >= this.currentRect.startX &&
			xBoundary <= this.currentRect.width + this.currentRect.startX &&
			yBoundary >= this.currentRect.startY &&
			yBoundary <= this.currentRect.height + this.currentRect.startY;
	}

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

	buildTableFromBox = (totalCols: number, totalRows: number) => {
		let tableRows: string[][] = [];
		for (let row = 0; row < totalRows + 1; row++) {
			for (let col = 0; col < totalCols + 1; col++) {
				if (tableRows[row] != undefined) {
					tableRows[row].push("");
				} else if (totalRows !== 0 || totalCols !== 0) {
					tableRows[row] = [""];
				} else {
					tableRows[row] = [];
				}
			}
		}
		return tableRows;
	};

	getItemsWithinRegion = () => {
		let parentItem = document.getElementById(this.containerID as string);

		this.currentRect.horizontalPointsSelected.sort(function (a, b) {
			return a.startY - b.startY;
		});

		this.currentRect.verticalPointsSelected.sort(function (a, b) {
			return a.startX - b.startX;
		});

		let tableRows: string[][] = this.buildTableFromBox(this.currentRect.verticalPointsSelected.length, this.currentRect.horizontalPointsSelected.length);
		this.currentRect.horizontalPointsSelected.push({startX: this.currentRect.startX, startY: this.currentRect.startY + this.currentRect.height, endX: this.currentRect.startX + this.currentRect.width});
		this.currentRect.verticalPointsSelected.push({startX: this.currentRect.startX + this.currentRect.width, startY: this.currentRect.startY, endY: this.currentRect.startY + this.currentRect.height});

		if (parentItem != null) {
			let divItems: NodeList = parentItem.childNodes;
			for (let i = 0; i < divItems.length; i++) {
				let spanItems: NodeList = divItems[i].childNodes;
				for (let j = 0; j < spanItems.length; j++) {
					let item: HTMLElement = spanItems[j] as HTMLElement;
					let itemBoundaryInfo: DOMRect = item.getBoundingClientRect()
					let itemPositionX = itemBoundaryInfo.x - this.canvas.offsetLeft;
					let itemPositionY = itemBoundaryInfo.y + this.canvas.offsetTop + window.scrollY;
					if (this.isItemInsideBox(itemPositionX, itemPositionY)) {
						let gridPosition: [number, number] = this.findGridPosition(itemPositionX, itemPositionY,
							this.currentRect.horizontalPointsSelected, this.currentRect.verticalPointsSelected);
						let gridRowPos: number = gridPosition[0];
						let gridColPos: number = gridPosition[1];
						if (tableRows[gridRowPos] != undefined) {
							let tableItem: string = tableRows[gridRowPos][gridColPos];
							let condition: boolean = tableItem != "" && tableItem != undefined;
							tableRows[gridRowPos][gridColPos] = condition ? tableRows[gridRowPos][gridColPos] + " " + item.innerText : item.innerText;
						} else {
							tableRows[gridRowPos] = [];
						}
					}
				}
			}
		}
		this.currentRect.horizontalPointsSelected.pop();
		this.currentRect.verticalPointsSelected.pop();
		return tableRows;
	}

	findGridPosition = (itemX: number, itemY: number, horizontalLines: HorizontalLineType[],
						verticalLines: VerticalLineType[]): [number, number] => {
		let col: number = 0;
		let row: number = 0;
		if (horizontalLines.length === 0) {
			for (let j = 0; j < verticalLines.length; j++) {
				let verticalLineXPos = verticalLines[j].startX
				if (itemX < verticalLineXPos) {
					row = 0;
					col = j;
				} else {
					col++;
				}
			}
		} else if (verticalLines.length === 0) {
			for (let i = 0; i < horizontalLines.length; i++) {
				let horizontalLineYPos = horizontalLines[i].startY;
				if (itemY < horizontalLineYPos) {
					row = i;
					col = 0;
				} else {
					row++;
				}
			}
		} else {
			for (let i = 0; i < horizontalLines.length; i++) {
				let horizontalLineYPos = horizontalLines[i].startY;
				for (let j = 0; j < verticalLines.length; j++) {
					let verticalLineXPos = verticalLines[j].startX
					if (itemX < verticalLineXPos && itemY < horizontalLineYPos) {
						return [i, j];
					}
				}
			}
		}
		return [row, col]
	}
}