import { FunctionComponent } from "react";
import { useGridData } from "./hooks/useGridData";
import { GridRectangle } from "./types/grid.rectangle.type";
import { HorizontalLineType } from "./types/horizontal.line.type";
import { VerticalLineType } from "./types/vertical.line.type";
import { ReactGridDrawLineOptionalProperties } from "./types/react.grid.line.properties.type";
declare const ReactGridDrawUI: FunctionComponent<ReactGridDrawLineOptionalProperties>;
export { ReactGridDrawUI, useGridData, ReactGridDrawLineOptionalProperties, GridRectangle, HorizontalLineType, VerticalLineType };
