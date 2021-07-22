type GridRectangle = {
	startX: number,
	startY: number
	width: number,
	height: number,
	colour?: string,
	horizontalPointsSelected: HorizontalLineType[],
	verticalPointsSelected: VerticalLineType[],
	undoLineList: boolean[]
}