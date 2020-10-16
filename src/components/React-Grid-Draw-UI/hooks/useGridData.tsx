import {CanvasManager} from "../partial/canvasManager";
import {useEffect, useState} from "react";

let canvasManager: CanvasManager | null = null;

export const useGridData = (): Function[] => {
	const [extractGridDataFunction, setExtractGridDataFunction] = useState<() => () => string[][]>(() => () => []);
	const [undoLastLineFunction, setUndoLastLineFunction] = useState<() => () => void>();

	useEffect(() => {
		if (canvasManager != null) {
			setExtractGridDataFunction(() => () => canvasManager != null ? canvasManager.getItemsWithinRegion() : []);
			setUndoLastLineFunction(() => () => canvasManager != null ? canvasManager.undoLastDrawnLine() : () => {});
		} else {
			throw "Something went wrong with the useGridData hook - If this issue persists, please contact library support.";
		}
	}, []);

	if (undoLastLineFunction == null) {
		return [extractGridDataFunction]
	} else {
		return [extractGridDataFunction, undoLastLineFunction];
	}
}

export const setCanvasManagerForHook = (inputCanvasManager: CanvasManager) => {
	canvasManager = inputCanvasManager;
}