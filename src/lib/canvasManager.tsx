import {RectangleCreationManager} from "./rectangleCreationManager";
import {RectangleBoundaryValidator} from "./rectangleBoundaryValidator";
import {setCreationManagersForHook} from "../hooks/useGridData";
import {PublicFunctionManager} from "./publicFunctionManager";
import {ReactGridDrawLineRequiredProperties} from "../types/react.grid.line.properties.type";
import {GridRectangle} from "../types/grid.rectangle.type";
import {HorizontalLineType} from "../types/horizontal.line.type";
import {GridActiveDragLineType} from "../types/grid.active.drag.line.type";
import {VerticalLineType} from "../types/vertical.line.type";

export class CanvasManager {

	private readonly lineProperties: ReactGridDrawLineRequiredProperties;
	private canvas: any;
	private ctx: any;
	private rectangleCreationManager: RectangleCreationManager;
	private rectangleBoundaryValidator: RectangleBoundaryValidator;
	private currentRect: GridRectangle;
	private drag: boolean = false;
	private activeDragLine: GridActiveDragLineType = {
		line: {horizontalLine: null, verticalLine: null},
		gridStartY: 0,
		gridEndY: 0,
		gridStartX: 0,
		gridEndX: 0
	}

	constructor(lineProperties: ReactGridDrawLineRequiredProperties) {
		this.currentRect = {
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			width: 0,
			height: 0,
			colour: lineProperties.lineColour,
			horizontalPointsSelected: [],
			verticalPointsSelected: [],
			undoLineList: []
		};
		this.rectangleCreationManager = new RectangleCreationManager(this.canvas, this.ctx, lineProperties);
		this.rectangleBoundaryValidator = new RectangleBoundaryValidator(this.canvas, lineProperties, this.rectangleCreationManager);
		this.lineProperties = lineProperties;
	}

	createCanvas = (containerWidth: number, containerHeight: number) => {
		this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.setCanvasSize(containerWidth, containerHeight);
		this.rectangleCreationManager = new RectangleCreationManager(this.canvas, this.ctx, this.lineProperties);
		this.rectangleBoundaryValidator = new RectangleBoundaryValidator(this.canvas, this.lineProperties, this.rectangleCreationManager);
		this.setUpMouseEvents();
		this.setUpKeyboardEvents();
		setCreationManagersForHook(new PublicFunctionManager(this.canvas, this.rectangleCreationManager.getRectangles(),
			this.rectangleCreationManager));
	}

	setCanvasSize = (containerWidth: number, containerHeight: number) => {
		this.canvas.width = containerWidth;
		this.canvas.height = containerHeight;
	}

	mouseDown = (e: MouseEvent) => {
		let mouseX = e.offsetX;
		let mouseY = e.offsetY;
		if (!this.rectangleBoundaryValidator.isMouseOnRemoveButtonForAnyGrid(mouseX, mouseY)) {
			let rectangleWithMouseOnBorder: GridRectangle | undefined = this.rectangleBoundaryValidator.getRectForMouseOnBorder(mouseX, mouseY);
			if (rectangleWithMouseOnBorder != undefined) {
				this.rectangleCreationManager.drawLineAtClickedGridBoundaryPosition(e, rectangleWithMouseOnBorder);
			} else {
				let rectangleInsideMouseClickPosition: GridRectangle | undefined = this.rectangleBoundaryValidator
					.getGridWhenMouseClickInsideGridRegion(mouseX, mouseY);
				let mouseClickNotInsideGrid: boolean = rectangleInsideMouseClickPosition === undefined;
				if (mouseClickNotInsideGrid) {
					this.rectangleCreationManager.resetBoxProperties(this.currentRect, mouseX, mouseY);
					this.drag = true;
				} else {
					let grid: GridRectangle = rectangleInsideMouseClickPosition as GridRectangle;
					let horizontalLineIndexFromMouseClick: number = this.rectangleBoundaryValidator.findHorizontalLineIndexInGridFromMousePosition(grid, mouseX, mouseY);
					let verticalLineIndexFromMouseClick: number  = this.rectangleBoundaryValidator.findVerticalLineIndexInGridFromMousePosition(grid, mouseX, mouseY);
					let hasClickedOnHorizontalLine: boolean = horizontalLineIndexFromMouseClick !== -1;
					let hasClickedOnVerticalLine: boolean = verticalLineIndexFromMouseClick !== -1;
					if (hasClickedOnHorizontalLine || hasClickedOnVerticalLine) {
						if (this.rectangleBoundaryValidator.isLineDeletionModeActive()) {
							if (hasClickedOnHorizontalLine) {
								grid.horizontalPointsSelected.splice(horizontalLineIndexFromMouseClick as number, 1);
							} else if (hasClickedOnVerticalLine) {
								grid.verticalPointsSelected.splice(verticalLineIndexFromMouseClick as number, 1);
							}
						} else {
							if (hasClickedOnHorizontalLine) {
								this.activeDragLine.line.horizontalLine = grid.horizontalPointsSelected[horizontalLineIndexFromMouseClick as number] as HorizontalLineType;
							} else if (hasClickedOnVerticalLine) {
								this.activeDragLine.line.verticalLine = grid.verticalPointsSelected[verticalLineIndexFromMouseClick as number] as VerticalLineType;
							}
						}
						this.activeDragLine.gridStartX = grid.startX;
						this.activeDragLine.gridStartY = grid.startY;
						this.activeDragLine.gridEndX = grid.endX;
						this.activeDragLine.gridEndY = grid.endY;
					}
				}
			}
		}
	}

	mouseUp = (e: MouseEvent) => {
		let gridWasDeleted: boolean = this.rectangleBoundaryValidator.deleteGridWhenRemoveButtonClicked(e.offsetX, e.offsetY);
		if (gridWasDeleted) {
			this.rectangleCreationManager.clearRegionFromCanvasContext(0, 0, this.canvas.width, this.canvas.height);
		} else {
			if (this.drag) {
				this.currentRect.endX = e.offsetX;
				this.currentRect.endY = e.offsetY;
				this.rectangleCreationManager.addRectangle(this.currentRect);
			}
			this.drag = false;
			this.currentRect = {
				startX: 0, startY: 0, endX: 0, endY: 0, width: 0, height: 0, colour: this.lineProperties.lineColour,
				verticalPointsSelected: [], horizontalPointsSelected: [], undoLineList: []
			}
		}
		this.rectangleCreationManager.clearRegionFromCanvasContext(0, 0, this.canvas.width, this.canvas.height);
		this.resetActiveGridLineForDragging();
		this.drawInteractableGrids(e);
	}

	mouseMove = (e: MouseEvent) => {
		this.rectangleCreationManager.clearRegionFromCanvasContext(0, 0, this.canvas.width, this.canvas.height);
		if (this.drag) {
			this.rectangleCreationManager.drawRectangleFromMouse(this.currentRect, e.offsetX + this.canvas.offsetLeft, e.offsetY + this.canvas.offsetTop);
		} else {
			if (this.activeDragLine.line.horizontalLine != null) {
				let draggedLineIsInsideGridRegion = this.activeDragLine.gridStartY < e.offsetY && this.activeDragLine.gridEndY > e.offsetY;
				if (draggedLineIsInsideGridRegion) {
					this.activeDragLine.line.horizontalLine.startY = e.offsetY;
				}
			} else if (this.activeDragLine.line.verticalLine != null) {
				let draggedLineIsInsideGridRegion = this.activeDragLine.gridStartX < e.offsetX && this.activeDragLine.gridEndX > e.offsetX;
				if (draggedLineIsInsideGridRegion) {
					this.activeDragLine.line.verticalLine.startX = e.offsetX;
				}
			} else {
				this.rectangleBoundaryValidator.showMouseCursorAsPointer(e, 'auto');
			}
		}
		this.drawInteractableGrids(e);
	}

	private setUpMouseEvents() {
		this.canvas.addEventListener('mousedown', this.mouseDown, false);
		this.canvas.addEventListener('mouseup', this.mouseUp, false);
		this.canvas.addEventListener('mousemove', this.mouseMove, false);
	}

	private setUpKeyboardEvents() {
		let CTRL_KEY = "Control";
		document.addEventListener('keydown', (e) => {
			if (e.key == CTRL_KEY) {
				this.rectangleBoundaryValidator.setLineDeletionMode(true);
			}
		});
		document.addEventListener('keyup', (e) => {
			if (e.key == CTRL_KEY) {
				this.rectangleBoundaryValidator.setLineDeletionMode(false);
			}
		});
	}

	private resetActiveGridLineForDragging(): void {
		this.activeDragLine.line = {verticalLine: null, horizontalLine: null};
		this.activeDragLine.gridStartX = 0;
		this.activeDragLine.gridStartY = 0;
		this.activeDragLine.gridEndX = 0;
		this.activeDragLine.gridEndY = 0;
	}

	private drawInteractableGrids(e: MouseEvent) {
		let mouseX = e.offsetX;
		let mouseY = e.offsetY;
		this.rectangleCreationManager.getRectangles().forEach((rect: GridRectangle) => {
			let boxStartPositionX = rect.startX + rect.width + this.canvas.offsetLeft;
			let boxStartPositionY = rect.startY + rect.height + this.canvas.offsetTop;
			this.rectangleBoundaryValidator.checkForMouseHoverOnGrid(rect, mouseX, mouseY, e);
			this.render(rect, boxStartPositionX, boxStartPositionY);
		});
	}

	private render(rect: GridRectangle, boxStartPositionX: number, boxStartPositionY: number) {
		this.rectangleCreationManager.drawRectangleFromMouse(rect, boxStartPositionX, boxStartPositionY);
		this.rectangleCreationManager.drawRectGridLines(rect);
		this.rectangleCreationManager.drawRemoveTableButton(rect);
	}
}