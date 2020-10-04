type ReactGridDrawLineOptionalProperties = {
	lineClickTolerance?: number,
	selectCircleSize?: number,
	circleLineShiftSize?: number,
	contextLineWidth?: number,
	getGridData: (data: string[][]) => void;
}

type ReactGridDrawLineRequiredProperties = {
	lineClickTolerance: number,
	selectCircleSize: number,
	circleLineShiftSize: number,
	contextLineWidth: number
}