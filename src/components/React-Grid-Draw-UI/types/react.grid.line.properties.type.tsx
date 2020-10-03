type ReactGridDrawLineOptionalProperties = {
	lineClickTolerance?: number,
	selectCircleSize?: number,
	circleLineShiftSize?: number,
	contextLineWidth?: number,
	getData: (data: string[][]) => void;
}

type ReactGridDrawLineRequiredProperties = {
	lineClickTolerance: number,
	selectCircleSize: number,
	circleLineShiftSize: number,
	contextLineWidth: number
}