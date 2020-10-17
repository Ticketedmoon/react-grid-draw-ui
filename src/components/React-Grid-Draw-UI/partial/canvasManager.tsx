export class CanvasManager {

	private canvas: any;
	private ctx: any;
	private drag: boolean = false;
	private body: HTMLElement | null = null;
	private containerID: string | null = null;

	private lineClickTolerance: number;
	private selectCircleSize: number;
	private circleLineShiftSize: number;
	private contextLineWidth: number

	private currentRect: GridRectangle;
	private rectangles: GridRectangle[];

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

}