import React, {
	CSSProperties,
	Fragment,
	FunctionComponent,
	PropsWithChildren,
	ReactElement,
	useEffect,
	useRef
} from "react";
import {useGridData} from "./hooks/useGridData";
import {CanvasManager} from "./lib/canvasManager";
import {GridRectangle} from "./types/grid.rectangle.type";
import {HorizontalLineType} from "./types/horizontal.line.type";
import {VerticalLineType} from "./types/vertical.line.type";
import {ReactGridDrawLineOptionalProperties} from "./types/react.grid.line.properties.type";

const canvasWrapStyle: CSSProperties = {
	display: "flex",
}

const canvasStyle: CSSProperties = {
	zIndex: 10000,
	width: "inherit",
	position: "absolute"
}

type CanvasContainerBox = {
	clientWidth: number,
	clientHeight: number
}

const ReactGridDrawUI: FunctionComponent<ReactGridDrawLineOptionalProperties> = (props: PropsWithChildren<ReactGridDrawLineOptionalProperties>): ReactElement => {

	const CANVAS_WRAP_ID: string = "canvas-wrap";

	const canvasManger = useRef<CanvasManager>(new CanvasManager({
		lineClickTolerance: props.lineClickTolerance as number,
		selectCircleSize: props.selectCircleSize as number,
		circleLineShiftSize: props.circleLineShiftSize as number,
		contextLineWidth: props.contextLineWidth as number,
		lineColour: props.lineColour as string
	}));

	useEffect(() => {
		let container: CanvasContainerBox = document.getElementById(CANVAS_WRAP_ID) as CanvasContainerBox;
		canvasManger.current.createCanvas(container.clientWidth, container.clientHeight);
	}, []);

	return (
		<Fragment>
			<div id={CANVAS_WRAP_ID} style={canvasWrapStyle}>
				{props.children}
				<canvas id="canvas" style={canvasStyle}/>
			</div>
		</Fragment>
	);
};

ReactGridDrawUI.defaultProps = {
	lineClickTolerance: 15,
	selectCircleSize: 3,
	circleLineShiftSize: 10,
	contextLineWidth: 1,
	lineColour: "#1290ff"
}

export {
	ReactGridDrawUI,
	useGridData,
	ReactGridDrawLineOptionalProperties,
	GridRectangle,
	HorizontalLineType,
	VerticalLineType
}