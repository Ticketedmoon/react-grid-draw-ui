let canvas: any;
let ctx: any;
let rect: any;
let drag: boolean;
let body: HTMLElement | null;

const LINE_CLICK_TOLERANCE = 15;
const SELECT_CIRCLE_SIZE = 3;
const CIRCLE_LINE_SHIFT_SIZE = 10;
const CONTEXT_LINE_WIDTH = 1;

let boxStartX: number;
let boxStartY: number;
let boxW: number;
let boxH: number

let horizontalPointsSelected: HorizontalLineType[] = [];
let verticalPointsSelected: VerticalLineType[] = [];

let undoLineList: boolean[] = [];

export const createCanvas = () => {
	canvas = document.getElementById('canvas');
	body = document.getElementById("generated-table-container");
	ctx = canvas.getContext('2d');
	rect = {};
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mouseup', mouseUp, false);
	canvas.addEventListener('mousemove', mouseMove, false);
	setCanvasSize();
}

const setCanvasSize = () => {
	if (body != null) {
		canvas.width = body.offsetWidth;
		canvas.height = body.offsetHeight;
	}
}

export const resetBoxProperties = (pageX: number, pageY: number) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	resetBoxPosition(pageX, pageY);
	rect.startX = pageX - canvas.offsetLeft;
	rect.startY = pageY - canvas.offsetTop;
	horizontalPointsSelected = [];
	verticalPointsSelected = [];
}

const mouseDown = (e: any) => {
	let startTop = rect.startY;
	let startLeft = rect.startX;
	let endBottom = boxH + startTop;
	let endRight = boxW + startLeft;
	let mouseX = e.pageX - canvas.offsetLeft;
	let mouseY = e.pageY - canvas.offsetTop;

	if (isMouseOnBoundaryOfBox(mouseX, startLeft, endRight, mouseY, startTop, endBottom)) {
		drawLineAtClickedGridBoundaryPosition(e);
	} else if (!isMouseClickInsideBoxRegion(e)) {
		resetBoxProperties(e.pageX, e.pageY);
		drag = true;
	}
}

const mouseUp = () => {
	drag = false;
}

function isMouseOnBoundaryOfBox(mouseX: number, startLeft: number, endRight: number, mouseY: number, startTop: number, endBottom: number) {
	let isTouchingBoundaryX = Math.abs(mouseX - startLeft) < LINE_CLICK_TOLERANCE || Math.abs(mouseX - endRight) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryY = Math.abs(mouseY - startTop) < LINE_CLICK_TOLERANCE || Math.abs(mouseY - endBottom) < LINE_CLICK_TOLERANCE;
	return isTouchingBoundaryX || isTouchingBoundaryY;
}

const isMouseClickInsideBoxRegion = (e: any): boolean => {
	let mouseX = Math.abs(parseInt(String(e.pageX - canvas.offsetLeft)));
	let mouseY = Math.abs(parseInt(String(e.pageY - canvas.offsetTop)));
	return mouseX >= rect.startX &&
		mouseX <= rect.w + rect.startX &&
		mouseY >= rect.startY &&
		mouseY <= rect.h + rect.startY;
}

function drawRect(pageX: number, pageY: number, w: number, h: number) {
	rect.w = (pageX - canvas.offsetLeft) - rect.startX;
	rect.h = (pageY - canvas.offsetTop) - rect.startY;
	ctx.strokeStyle = 'red';
	ctx.lineWidth = CONTEXT_LINE_WIDTH;
	ctx.strokeRect(rect.startX, rect.startY, w, h);
}

function drawLineAtClickedGridBoundaryPosition(e: any) {
	let startTop = rect.startY;
	let startLeft = rect.startX;
	let endBottom = boxH + startTop;
	let endRight = boxW + startLeft;
	let mouseX = e.pageX - canvas.offsetLeft;
	let mouseY = e.pageY - canvas.offsetTop;
	let isTouchingBoundaryStartX = Math.abs(mouseX - startLeft) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryStartY = Math.abs(mouseY - startTop) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < LINE_CLICK_TOLERANCE;
	if (isTouchingBoundaryStartX || isTouchingBoundaryEndX) {
		let line: HorizontalLineType = {startX: startLeft, startY: getShiftRateFromMousePosition(mouseY), endX: endRight};
		horizontalPointsSelected.push(line);
		undoLineList.push(true);
		drawLineFromBoxBoundaryX(line);
	} else if (isTouchingBoundaryStartY || isTouchingBoundaryEndY) {
		let line: VerticalLineType = {startX: getShiftRateFromMousePosition(mouseX), startY: startTop, endY: endBottom};
		verticalPointsSelected.push(line);
		drawLineFromBoxBoundaryY(line);
		undoLineList.push(false);
	}
}

const checkForCircleOnBoundary = (e: any) => {
	let startTop = rect.startY;
	let startLeft = rect.startX;
	let endBottom = boxH + startTop;
	let endRight = boxW + startLeft;
	let mouseX = e.pageX - canvas.offsetLeft;
	let mouseY = e.pageY - canvas.offsetTop;
	let isTouchingBoundaryStartX = Math.abs(mouseX - startLeft) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryEndX = Math.abs(mouseX - endRight) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryStartY = Math.abs(mouseY - startTop) < LINE_CLICK_TOLERANCE;
	let isTouchingBoundaryEndY = Math.abs(mouseY - endBottom) < LINE_CLICK_TOLERANCE;
	if (isTouchingBoundaryStartX && mouseY > rect.startY && mouseY < rect.startY + rect.h) {
		let shiftRateFromMousePosition = getShiftRateFromMousePosition(mouseY);
		let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
		drawSelectableCircleOnBoxBoundary(startLeft, shiftRateFromMousePosition);
		drawLineFromBoxBoundaryX(line);
	} else if (isTouchingBoundaryEndX && mouseY > rect.startY && mouseY < rect.startY + rect.h) {
		let shiftRateFromMousePosition = getShiftRateFromMousePosition(mouseY);
		let line: HorizontalLineType = {startX: startLeft, startY: shiftRateFromMousePosition, endX: endRight};
		drawSelectableCircleOnBoxBoundary(endRight, shiftRateFromMousePosition);
		drawLineFromBoxBoundaryX(line);
	} else if (isTouchingBoundaryStartY && mouseX > rect.startX && mouseX < rect.startX + rect.w) {
		let shiftRateFromMousePosition = getShiftRateFromMousePosition(mouseX);
		let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: startTop, endY: endBottom};
		drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, startTop);
		drawLineFromBoxBoundaryY(line);
	} else if (isTouchingBoundaryEndY && mouseX > rect.startX && mouseX < rect.startX + rect.w) {
		let shiftRateFromMousePosition = getShiftRateFromMousePosition(mouseX);
		let line: VerticalLineType = {startX: shiftRateFromMousePosition, startY: endBottom, endY: startTop};
		drawSelectableCircleOnBoxBoundary(shiftRateFromMousePosition, endBottom);
		drawLineFromBoxBoundaryY(line);
	}
}

const getShiftRateFromMousePosition = (mousePos: number) => {
	return Math.round(mousePos / CIRCLE_LINE_SHIFT_SIZE) * CIRCLE_LINE_SHIFT_SIZE;
}

const resetBoxPosition = (pageX: number, pageY: number) => {
	boxStartX = pageX;
	boxStartY = pageY;
	boxW = rect.w;
	boxH = rect.h;
}

const mouseMove = (e: any) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (drag && body != null) {
		resetBoxPosition(e.pageX, e.pageY);
	} else if (!drag) {
		let startTop = rect.startY;
		let startLeft = rect.startX;
		let endBottom = boxH + startTop;
		let endRight = boxW + startLeft;
		let mouseX = e.pageX - canvas.offsetLeft;
		let mouseY = e.pageY - canvas.offsetTop;
		if (isMouseOnBoundaryOfBox(mouseX, startLeft, endRight, mouseY, startTop, endBottom)) {
			checkForCircleOnBoundary(e);
		}
	}
	drawRect(boxStartX, boxStartY, boxW, boxH);
	drawAllSelectedLines();
}

const drawAllSelectedLines = () => {
	horizontalPointsSelected.forEach((line: HorizontalLineType) => {
		drawLineFromBoxBoundaryX(line);
	});

	verticalPointsSelected.forEach((line: VerticalLineType) => {
		drawLineFromBoxBoundaryY(line);
	});
}

const drawSelectableCircleOnBoxBoundary = (mouseX: number, mouseY: number) => {
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.arc(mouseX, mouseY, SELECT_CIRCLE_SIZE, 0, Math.PI * 2);
	ctx.closePath();
	ctx.fill();
}

const drawLineFromBoxBoundaryX = (line: HorizontalLineType) => {
	ctx.fillStyle = 'red';
	ctx.beginPath();
	ctx.lineWidth = CONTEXT_LINE_WIDTH;
	ctx.moveTo(line.startX, line.startY);
	ctx.lineTo(line.endX, line.startY);
	ctx.closePath();
	ctx.stroke();
}

const drawLineFromBoxBoundaryY = (line: VerticalLineType) => {
	ctx.fillStyle = 'red';
	ctx.lineWidth = CONTEXT_LINE_WIDTH;
	ctx.beginPath();
	ctx.moveTo(line.startX, line.startY);
	ctx.lineTo(line.startX, line.endY);
	ctx.closePath();
	ctx.stroke();
}

const isItemInsideBox = (xBoundary: number, yBoundary: number) => {
	return xBoundary >= rect.startX &&
		xBoundary <= rect.w + rect.startX &&
		yBoundary >= rect.startY &&
		yBoundary <= boxH + rect.startY;
}

export const undoLastDrawnLine = () => {
	let isLastLineHorizontal = undoLineList.pop();
	if (isLastLineHorizontal) {
		horizontalPointsSelected.pop();
	} else {
		verticalPointsSelected.pop();
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawRect(boxStartX, boxStartY, boxW, boxH);
	drawAllSelectedLines();
}

const buildTableFromBox = (totalCols: number, totalRows: number) => {
	let tableRows: string[][] = [];
	for (let row = 0; row < totalRows + 1; row++) {
		for (let col = 0; col < totalCols + 1; col++) {
			if (tableRows[row] != undefined) {
				tableRows[row].push("");
			} else {
				tableRows[row] = [""];
			}
		}
	}
	return tableRows;
};

export const getItemsWithinRegion = () => {
	let parentItem = document.getElementById("generated-table-container");

	horizontalPointsSelected.sort(function(a, b) {
		return a.startY - b.startY;
	});

	verticalPointsSelected.sort(function(a, b) {
		return a.startX - b.startX;
	});

	let tableRows: string[][] = buildTableFromBox(verticalPointsSelected.length, horizontalPointsSelected.length);
	horizontalPointsSelected.push({startX: rect.startX, startY: rect.startY + rect.h, endX: rect.startX + rect.w});
	verticalPointsSelected.push({startX: rect.startX + rect.w, startY: rect.startY, endY: rect.startY + rect.h});

	if (parentItem != null) {
		let divItems: NodeList = parentItem.childNodes;
		for (let i = 0; i < divItems.length; i++) {
			let spanItems: NodeList = divItems[i].childNodes;
			for (let j = 0; j < spanItems.length; j++) {
				let item: HTMLElement = spanItems[j] as HTMLElement;
				let itemBoundaryInfo: DOMRect = item.getBoundingClientRect();
				let itemPositionX = itemBoundaryInfo.x - canvas.offsetLeft;
				let itemPositionY = itemBoundaryInfo.y - canvas.offsetTop + window.scrollY;
				if (isItemInsideBox(itemPositionX, itemPositionY)) {
					let gridPosition: [number, number] = findGridPosition(itemPositionX, itemPositionY,
						horizontalPointsSelected, verticalPointsSelected);
					let gridRowPos: number = gridPosition[0];
					let gridColPos: number = gridPosition[1];
					tableRows[gridRowPos][gridColPos] += item.innerText + " ";
				}
			}
		}
	}

	return tableRows;
}

const findGridPosition = (itemX: number, itemY: number, horizontalLines: HorizontalLineType[],
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
	}
	else if (verticalLines.length === 0) {
		for (let i = 0; i < horizontalLines.length; i++) {
			let horizontalLineYPos = horizontalLines[i].startY;
			if (itemY < horizontalLineYPos) {
				row = i;
				col = 0;
			} else {
				row++;
			}
		}
	}
	else {
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