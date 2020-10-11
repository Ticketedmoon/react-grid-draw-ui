import {CanvasManager} from "../partial/canvasManager";
import {useEffect, useState} from "react";

let canvasManager: CanvasManager | null = null;

export const useGridData = (inputCanvasManager: CanvasManager | null): (() => string[][]) | undefined => {
	const [func, setFunc] = useState<() => string[][]>();
	useEffect(() => {
		if (canvasManager == null) {
			canvasManager = inputCanvasManager;
		} else {
			console.log(canvasManager.getItemsWithinRegion);
			setFunc(canvasManager.getItemsWithinRegion);
		}
	}, [inputCanvasManager]);

	return func;
}