import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleBoundaryValidator} from "./rectangleBoundaryValidator";
import {setCreationManagersForHook} from "../hooks/useGridData";
import {GridOutputManager} from "./gridOutputManager";

export class CanvasManager {

	private readonly rectangles: GridRectangle[];
	private readonly lineProperties: ReactGridDrawLineRequiredProperties;
	private canvas: any;
	private ctx: any;
	private rectangleCreationManager: RectangleCreationManager;
	private rectangleBoundaryValidator: RectangleBoundaryValidator;
	private currentRect: GridRectangle;
	private containerID: string | null = null;
	private drag: boolean = false;
	private body: HTMLElement | null = null;

	constructor(lineProperties: ReactGridDrawLineRequiredProperties) {
		this.rectangles = [];
		this.currentRect = {startX: 0, startY: 0, width: 0, height: 0, horizontalPointsSelected: [], verticalPointsSelected: [], undoLineList: []};
		this.rectangleCreationManager = new RectangleCreationManager(this.canvas, this.ctx, this.rectangles, this.currentRect, lineProperties);
		this.rectangleBoundaryValidator = new RectangleBoundaryValidator(this.canvas, this.currentRect, lineProperties, this.rectangleCreationManager);
		this.lineProperties = lineProperties;
	}

	createCanvas = (containerID: string) => {
		this.containerID = containerID;
		this.body = document.getElementById(this.containerID);
		this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mousemove', this.mouseMove, false);
		this.setCanvasSize();

		this.rectangleCreationManager = new RectangleCreationManager(this.canvas, this.ctx, this.rectangles, this.currentRect, this.lineProperties);
		this.rectangleBoundaryValidator = new RectangleBoundaryValidator(this.canvas, this.currentRect, this.lineProperties, this.rectangleCreationManager);
		setCreationManagersForHook(this.rectangleCreationManager, new GridOutputManager(this.canvas, this.currentRect));
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

		if (this.rectangleBoundaryValidator.isMouseOnBoundaryOfBox(mouseX, startLeft, endRight, mouseY, startTop, endBottom)) {
			this.rectangleCreationManager.drawLineAtClickedGridBoundaryPosition(e);
		} else if (!this.rectangleBoundaryValidator.isMouseClickInsideBoxRegion(e)) {
			this.rectangleCreationManager.resetBoxProperties(this.currentRect, mouseX, mouseY);
			this.drag = true;
		}
	}

	mouseUp = (e: MouseEvent) => {
		this.drag = false;
		this.rectangles.push(this.currentRect);
		this.currentRect = {startX: 0, startY: 0, width: 0, height: 0, verticalPointsSelected: [], horizontalPointsSelected: [], undoLineList: []}
		this.drawAllCreatedRectangles(e);
	}

	mouseMove = (e: MouseEvent) => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (this.drag && this.body != null) {
			this.rectangleCreationManager.drawCurrentRectangle(this.currentRect, e.pageX, e.pageY);
		} else if (!this.drag) {
			this.rectangleBoundaryValidator.CheckForMouseOnBoxBoundaryOfRectAndReDraw(this.currentRect, e);
		}
		this.drawAllCreatedRectangles(e);
	}

	drawAllCreatedRectangles = (e: MouseEvent) => {
		this.rectangles.forEach((rect: GridRectangle) => {
			this.rectangleBoundaryValidator.CheckForMouseOnBoxBoundaryOfRectAndReDraw(rect, e);
			rect.horizontalPointsSelected.forEach((line: HorizontalLineType) => {
				this.rectangleCreationManager.drawLineFromBoxBoundaryX(line);
			});
			rect.verticalPointsSelected.forEach((line: VerticalLineType) => {
				this.rectangleCreationManager.drawLineFromBoxBoundaryY(line);
			});
		});
	}

}