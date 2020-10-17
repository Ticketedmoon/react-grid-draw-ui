type GridRectangle = {
	startX: number,
	startY: number
	width: number,
	height: number,
	horizontalPointsSelected: HorizontalLineType[],
	verticalPointsSelected: VerticalLineType[],
	undoLineList: boolean[]
}