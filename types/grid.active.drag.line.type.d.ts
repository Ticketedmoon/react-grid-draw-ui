import { HorizontalLineType } from "./horizontal.line.type";
import { VerticalLineType } from "./vertical.line.type";
export declare type GridActiveDragLineType = {
    line: {
        horizontalLine: HorizontalLineType | null;
        verticalLine: VerticalLineType | null;
    };
    gridStartY: number;
    gridEndY: number;
    gridStartX: number;
    gridEndX: number;
};
