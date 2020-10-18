import {useEffect, useState} from "react";
import {PublicFunctionManager} from "../lib/publicFunctionManager";

let gridOutputManager: PublicFunctionManager | null = null;

export const useGridData = (): Function[] => {
	const [extractGridDataFunction, setExtractGridDataFunction] = useState<() => () => string[][][]>(() => () => []);
	const [undoLastLineFunction, setUndoLastLineFunction] = useState<() => () => void>();

	useEffect(() => {
		if (gridOutputManager != null) {
			setExtractGridDataFunction(() => () => gridOutputManager != null ? gridOutputManager.getItemsWithinRegion() : []);
			setUndoLastLineFunction(() => () => gridOutputManager != null ? gridOutputManager.undoLastDrawnLineForLatestRectangle() : () => {});
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

export const setCreationManagersForHook = (inputGridOutputManager: PublicFunctionManager) => {
	gridOutputManager = inputGridOutputManager;
}