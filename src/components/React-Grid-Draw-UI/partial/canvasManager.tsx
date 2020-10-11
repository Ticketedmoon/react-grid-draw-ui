export class CanvasManager {

	canvas: any;
	ctx: any;
	rect: any;
	drag: boolean = false;
	body: HTMLElement | null = null;
	containerID: string | null = null;

	lineClickTolerance: number;
	selectCircleSize: number;
	circleLineShiftSize: number;
	contextLineWidth: number

	boxStartX: number = 0;
	boxStartY: number = 0;
	boxW: number = 0;
	boxH: number = 0;

	horizontalPointsSelected: HorizontalLineType[] = [];
	verticalPointsSelected: VerticalLineType[] = [];

	undoLineList: boolean[] = [];

	constructor(lineProperties: ReactGridDrawLineRequiredProperties) {
		this.lineClickTolerance = lineProperties.lineClickTolerance;
		this.selectCircleSize = lineProperties.selectCircleSize;
		this.circleLineShiftSize = lineProperties.circleLineShiftSize;
		this.contextLineWidth = lineProperties.contextLineWidth;
	}

	createCanvas = (containerID: string) => {
		this.containerID = containerID;
		this.canvas = document.getElementById('canvas');
		this.body = document.getElementById(this.containerID);
		this.ctx = this.canvas.getContext('2d');
		this.rect = {};
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

	resetBoxProperties = (pageX: number, pageY: number) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.resetBoxPosition(pageX, pageY);
		this.rect.startX = pageX - this.canvas.offsetLeft;
		this.rect.startY = pageY - this.canvas.offsetTop;
		this.horizontalPointsSelected = [];
		this.verticalPointsSelected = [];
	}

	mouseDown = (e: any) => {
		let startTop = this.rect.startY;
		let startLeft = this.rect.startX;
		let endBottom = this.boxH + startTop;
		let endRight = this.boxW + startLeft;
		let mouseX = e.pageX - this.canvas.offsetLeft;
		let mouseY = e.pageY - this.canvas.offsetTop;

		if (this.isMouseOnBoundaryOfBox(mouseX, startLeft, endRight, mouseY, startTop, endBottom)) {
			this.drawLineAtClickedGridBoundaryPosition(e);
		} else if (!this.isMouseClickInsideBoxRegion(e)) {
			this.resetBoxProperties(e.pageX, e.pageY);
			this.drag = true;
		}
	}

	mouseUp = () => {
		this.drag = false;
	}

	isMouseOnBoundaryOfBox(mouseX: number, startLeft: number, endRight: number, mouseY: number, startTop: number, endBottom: number) {
		let isTouchingBoundaryX = Math.abs(mouseX - startLeft) < this.lineClickTolerance || Math.abs(mouseX - endRight) < this.lineClickTolerance;
		let isTouchingBoundaryY = Math.abs(mouseY - startTop) < this.lineClickTolerance || Math.abs(mouseY - endBottom) < this.lineClickTolerance;
		return isTouchingBoundaryX || isTouchingBoundaryY;
	}

	isMouseClickInsideBoxRegion = (e: any): boolean => {
		let mouseX = Math.abs(parseInt(String(e.pageX - this.canvas.offsetLeft)));
		let mouseY = Math.abs(parseInt(String(e.pageY - this.canvas.offsetTop)));
		return mouseX >= this.rect.startX &&
			mouseX <= this.rect.w + this.rect.startX &&
			mouseY >= this.rect.startY &&
			mouseY <= this.rect.h + this.rect.startY;
	}

	drawRect(pageX: number, pageY: number, w: number, h: number) {
		this.rect.w = (pageX - this.canvas.offsetLeft) - this.rect.startX;
		this.rect.h = (pageY - this.canvas.offsetTop) - this.rect.startY;
		this.ctx.strokeStyle = 'red';
		this.ctx.lineWidth = this.contextLineWidth;
		this.ctx.strokeRect(this.rect.startX, this.rect.startY, w, h);
	}

	drawLineAtClickedGridBoundaryPosition(e: any) {
		let startTop = this.rect.startY;
		let startLeft = this.rect.startX;
		let endBottom = this.boxH + startTop;
		let endRight = this.boxW + startLeft;
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
			this.horizontalPointsSelected.push(line);
			this.undoLineList.push(true);
			this.drawLineFromBoxBoundaryX(line);
		} else if (isTouchingBoundaryStartY || isTouchingBoundaryEndY) {
			let line: VerticalLineType = {
				startX: this.getShiftRateFromMousePosition(mouseX),
				startY: startTop,
				endY: endBottom
			};
			this.verticalPointsSelected.push(line);
			this.drawLineFromBoxBoundaryY(line);
			this.undoLineList.push(false);
		}
	}

	checkForCircleOnBoundary = (e: any) => {
		let startTop = this.rect.startY;
		let startLeft = this.rect.startX;
		let endBottom = this.boxH + startTop;
		let endRight = this.boxW + startLeft;
		let mouseX = e.pageX - this.canvas.offsetLeft;
		let mouseY = e.pageY - this.canvas.offsetTop;
		let isTouchingBoundaryStartX = Math.abs(mouseX - startLeft) < this.lineClickTolerance;
		let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < this.lineClickTolerance;
		let isTouchingBoundaryStartY = Math.abs(mouseY - startTop) < this.lineClickTolerance;
		let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < this.lineClickTolerance;
		if (isTouchingBoundaryStartX && mouseY > this.rect.startY && mouseY < this.rect.startY + this.rect.h) {
			let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseY);
			let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
			this.drawSelectableCircleOnBoxBoundary(startLeft, shiftRateFromMousePosition);
			this.drawLineFromBoxBoundaryX(line);
		} else if (isTouchingBoundaryEndX && mouseY > this.rect.startY && mouseY < this.rect.startY + this.rect.h) {
			let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseY);
			let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
			this.drawSelectableCircleOnBoxBoundary(endRight, shiftRateFromMousePosition);
			this.drawLineFromBoxBoundaryX(line);
		} else if (isTouchingBoundaryStartY && mouseX > this.rect.startX && mouseX < this.rect.startX + this.rect.w) {
			let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseX);
			let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: startTop, endY: endBottom};
			this.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, startTop);
			this.drawLineFromBoxBoundaryY(line);
		} else if (isTouchingBoundaryEndY && mouseX > this.rect.startX && mouseX < this.rect.startX + this.rect.w) {
			let shiftRateFromMousePosition = this.getShiftRateFromMousePosition(mouseX);
			let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: endBottom, endY: startTop};
			this.drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, endBottom);
			this.drawLineFromBoxBoundaryY(line);
		}
	}

	getShiftRateFromMousePosition = (mousePos: number) => {
		return Math.round(mousePos / this.circleLineShiftSize) * this.circleLineShiftSize;
	}

	resetBoxPosition = (pageX: number, pageY: number) => {
		this.boxStartX = pageX;
		this.boxStartY = pageY;
		this.boxW = this.rect.w;
		this.boxH = this.rect.h;
	}

	mouseMove = (e: any) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.drag && this.body != null) {
			this.resetBoxPosition(e.pageX, e.pageY);
		} else if (!this.drag) {
			let startTop = this.rect.startY;
			let startLeft = this.rect.startX;
			let endBottom = this.boxH + startTop;
			let endRight = this.boxW + startLeft;
			let mouseX = e.pageX - this.canvas.offsetLeft;
			let mouseY = e.pageY - this.canvas.offsetTop;
			if (this.isMouseOnBoundaryOfBox(mouseX, startLeft, endRight, mouseY, startTop, endBottom)) {
				this.checkForCircleOnBoundary(e);
			}
		}
		this.drawRect(this.boxStartX, this.boxStartY, this.boxW, this.boxH);
		this.drawAllSelectedLines();
	}

	drawAllSelectedLines = () => {
		this.horizontalPointsSelected.forEach((line: HorizontalLineType) => {
			this.drawLineFromBoxBoundaryX(line);
		});

		this.verticalPointsSelected.forEach((line: VerticalLineType) => {
			this.drawLineFromBoxBoundaryY(line);
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
		return xBoundary >= this.rect.startX &&
			xBoundary <= this.rect.w + this.rect.startX &&
			yBoundary >= this.rect.startY &&
			yBoundary <= this.boxH + this.rect.startY;
	}

	undoLastDrawnLine = () => {
		let isLastLineHorizontal = this.undoLineList.pop();
		if (isLastLineHorizontal) {
			this.horizontalPointsSelected.pop();
		} else {
			this.verticalPointsSelected.pop();
		}
		this.ctx.clearthis.rect(0, 0, this.canvas.width, this.canvas.height);
		this.drawRect(this.boxStartX, this.boxStartY, this.boxW, this.boxH);
		this.drawAllSelectedLines();
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

		this.horizontalPointsSelected.sort(function (a, b) {
			return a.startY - b.startY;
		});

		this.verticalPointsSelected.sort(function (a, b) {
			return a.startX - b.startX;
		});

		let tableRows: string[][] = this.buildTableFromBox(this.verticalPointsSelected.length, this.horizontalPointsSelected.length);

		if (parentItem != null) {
			let divItems: NodeList = parentItem.childNodes;
			for (let i = 0; i < divItems.length; i++) {
				let spanItems: NodeList = divItems[i].childNodes;
				for (let j = 0; j < spanItems.length; j++) {
					let item: HTMLElement = spanItems[j] as HTMLElement;
					let itemBoundaryInfo: DOMRect = item.getBoundingClientRect()
					let itemPositionX = itemBoundaryInfo.x - this.canvas.offsetLeft;
					let itemPositionY = itemBoundaryInfo.y - this.canvas.offsetTop + window.scrollY;
					if (this.isItemInsideBox(itemPositionX, itemPositionY)) {
						let gridPosition: [number, number] = this.findGridPosition(itemPositionX, itemPositionY,
							this.horizontalPointsSelected, this.verticalPointsSelected);
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