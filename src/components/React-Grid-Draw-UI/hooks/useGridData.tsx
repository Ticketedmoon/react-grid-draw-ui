import {CanvasManager} from "../partial/canvasManager";
import {useEffect, useState} from "react";

let canvasManager: CanvasManager | null = null;

export const useGridData = (inputCanvasManager: CanvasManager | null): (() => () => string[][]) => {
	const [func, setFunc] = useState<() => () => string[][]>(() => () => []);
	useEffect(() => {
		if (canvasManager == null) {
			canvasManager = inputCanvasManager;
		} else {
			setFunc(() => () => canvasManager != null ? canvasManager.getItemsWithinRegion() : []);
		}
	}, [inputCanvasManager]);

	return func;
}