import React, {Fragment, FunctionComponent, PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {CanvasManager} from "./partial/canvasManager";

const style = require("./style/style.module.css");

export const ReactGridDrawUI: FunctionComponent<ReactGridDrawLineOptionalProperties> = (props: PropsWithChildren<ReactGridDrawLineOptionalProperties>): ReactElement => {

	const [canvasManger, setCanvasManager] = useState<CanvasManager>(new CanvasManager({
		lineClickTolerance: props.lineClickTolerance as number,
		selectCircleSize: props.selectCircleSize as number,
		circleLineShiftSize: props.circleLineShiftSize as number,
		contextLineWidth: props.contextLineWidth as number
	}));
	const [hasDataBeenRead, setHasDataBeenRead] = useState<boolean>(false);

	useEffect(() => {
		canvasManger.createCanvas();
	}, []);

	useEffect(() => {
		if (Object.keys(canvasManger.rect).length !== 0 && !hasDataBeenRead) {
			props.getGridData(canvasManger.getItemsWithinRegion());
			setHasDataBeenRead(true);
		}
	}, [props.getGridData])

	useEffect(() => {
		if (hasDataBeenRead) {
			setHasDataBeenRead(false);
		}
	}, [hasDataBeenRead])

	return (
		<Fragment>
			<div className={style["page-container"]}>
				<div id="canvas-wrap" className={style["canvas-wrap"]}>
					{props.children}
					<canvas id="canvas"/>
				</div>
			</div>
		</Fragment>
	);
};

ReactGridDrawUI.defaultProps = {
	lineClickTolerance: 15,
	selectCircleSize: 3,
	circleLineShiftSize: 10,
	contextLineWidth: 1
}