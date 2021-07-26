import {useEffect, useState} from "react";
import {PublicFunctionManager} from "../lib/publicFunctionManager";
import {GridRectangle} from "../types/grid.rectangle.type";

let gridOutputManager: PublicFunctionManager | null = null;

export const useGridData = (): Function[] => {

	const [extractGridDataFunction, setExtractGridDataFunction] = useState<() => () => string[][][]>(() => () => []);
	const [undoLastRectangle, setUndoLastRectangle] = useState<() => () => void>();
	const [undoLastLineFunction, setUndoLastLineFunction] = useState<() => () => void>();
	const [drawRectanglesFromPayloadFunction, setDrawRectanglesFromPayloadFunction] = useState<() => (rects: GridRectangle[]) => void>();

	useEffect(() => {
		if (gridOutputManager != null) {
			setExtractGridDataFunction(() => () => gridOutputManager != null ? gridOutputManager.getItemsWithinRegion() : []);
			setUndoLastRectangle(() => () => gridOutputManager != null ? gridOutputManager.undoLastRectangle() : () => {});
			setUndoLastLineFunction(() => () => gridOutputManager != null ? gridOutputManager.undoLastDrawnLineForLatestRectangle() : () => {});
			setDrawRectanglesFromPayloadFunction(() => (rects: GridRectangle[]) => gridOutputManager != null ? gridOutputManager.drawRectanglesFromPayload(rects) : () => {});
		} else {
			throw "Something went wrong with the useGridData hook - If this issue persists, please contact library support.";
		}
	}, []);

	if (undoLastLineFunction == null || undoLastRectangle == null || drawRectanglesFromPayloadFunction == null) {
		return [extractGridDataFunction]
	} else {
		return [extractGridDataFunction, undoLastRectangle, undoLastLineFunction, drawRectanglesFromPayloadFunction];
	}
}

export const setCreationManagersForHook = (inputGridOutputManager: PublicFunctionManager) => {
	gridOutputManager = inputGridOutputManager;
}