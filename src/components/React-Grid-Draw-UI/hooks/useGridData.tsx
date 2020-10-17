import {useEffect, useState} from "react";
import {RectangleCreationManager} from "../lib/rectangleCreationManager";
import {GridOutputManager} from "../lib/gridOutputManager";

let rectangleCreationManager: RectangleCreationManager | null = null;
let gridOutputManager: GridOutputManager | null = null;

export const useGridData = (): Function[] => {
	const [extractGridDataFunction, setExtractGridDataFunction] = useState<() => () => string[][]>(() => () => []);
	const [undoLastLineFunction, setUndoLastLineFunction] = useState<() => () => void>();

	useEffect(() => {
		if (rectangleCreationManager != null && gridOutputManager != null) {
			setExtractGridDataFunction(() => () => gridOutputManager != null ? gridOutputManager.getItemsWithinRegion() : []);
			setUndoLastLineFunction(() => () => rectangleCreationManager != null ? rectangleCreationManager.undoLastDrawnLine() : () => {});
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

export const setCreationManagersForHook = (inputRectangleCreationManager: RectangleCreationManager, inputGridOutputManager: GridOutputManager) => {
	rectangleCreationManager = inputRectangleCreationManager;
	gridOutputManager = inputGridOutputManager;
}