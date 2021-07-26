import {HorizontalLineType} from "./horizontal.line.type";
import {VerticalLineType} from "./vertical.line.type";

export type GridRectangle = {
	startX: number,
	startY: number
	width: number,
	height: number,
	colour?: string,
	horizontalPointsSelected: HorizontalLineType[],
	verticalPointsSelected: VerticalLineType[],
	undoLineList: boolean[]
}