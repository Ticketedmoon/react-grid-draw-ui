import React, {Fragment, FunctionComponent, PropsWithChildren, ReactElement, useEffect, useState} from "react";
import HyperModal from 'react-hyper-modal';
import {CanvasManager} from "./partial/canvasManager";

const style = require("./style/style.module.css");

export const ReactGridDrawUI: FunctionComponent<ReactGridDrawLineOptionalProperties> = (props: PropsWithChildren<ReactGridDrawLineOptionalProperties>): ReactElement => {

	const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);
	const canvasManger: CanvasManager = new CanvasManager({
		lineClickTolerance: props.lineClickTolerance as number,
		selectCircleSize: props.selectCircleSize as number,
		circleLineShiftSize: props.circleLineShiftSize as number,
		contextLineWidth: props.contextLineWidth as number
	});

	useEffect(() => {
		canvasManger.createCanvas();
	}, []);

	const buildTable = () => {
		let grid: string[][] = canvasManger.getItemsWithinRegion();
		let tbody = document.getElementById('tbody') as HTMLElement;
		tbody.innerHTML = "";
		for (let i = 0; i < grid.length; i++) {
			let val: string[] = grid[i] as string[];
			let tr = "<tr>";
			for (let item of val) {
				tr += buildHtmlTableCellFromMapRow(item);
			}
			tr += "</tr>";
			tbody.innerHTML += tr;
		}
		canvasManger.resetBoxProperties(0, 0);
	}

	const buildHtmlTableCellFromMapRow = (item: string) => {
		return "<td>" + item.toString() + "</td>";
	}

	const openModal = () => {
		buildTable();
		setIsCopyModalOpen(true);
	}

	const closeModal = () => {
		setIsCopyModalOpen(false);
	}

	const copyToClipboard = () => {
		const elTable: HTMLElement = document.getElementById('table-container-id') as HTMLElement;
		let range, sel;
		if (document.createRange && window.getSelection) {
			range = document.createRange();
			sel = window.getSelection();
			if (sel != null) {
				sel.removeAllRanges();
				try {
					range.selectNodeContents(elTable);
					sel.addRange(range);
				} catch (e) {
					range.selectNode(elTable);
					sel.addRange(range);
				}
				document.execCommand('copy');
			}
		}
	}

	return (
		<Fragment>
			<div className={style["page-container"]}>
				<div className={style["sidenav"]}>
					<a className={style["copy"]} onClick={() => openModal()}>Copy</a>
					<a className={style["undo"]} onClick={() => canvasManger.undoLastDrawnLine()}> Undo </a>
				</div>
				<div id="canvas-wrap" className={style["canvas-wrap"]}>
					{props.children}
					<canvas id="canvas"/>
				</div>
			</div>
			<div className={style["modal-wrapper"]}>
				<HyperModal
					isOpen={isCopyModalOpen}
					requestClose={() => closeModal()}>
					<div>
						<div className={style["modal-title-container"]}>
							<h3 className={style["modal-title"]}> Copy the table below into Excel </h3>
						</div>
						<table id={"table-container-id"} className={style["table-container"]}>
							<tbody id="tbody"/>
						</table>
						<button onClick={() => copyToClipboard()}> Copy to Clipboard </button>

					</div>
				</HyperModal>
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