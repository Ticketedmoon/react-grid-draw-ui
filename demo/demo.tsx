import React from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI, useGridData} from "../src";
import {Helper} from "./helper";

const style = require("./style.module.css");

const App: React.FunctionComponent = () => {

	const [getGridData, undoLastRect, undoLastLine]: Function[] = useGridData();

	return (
		<div className={style["application-container"]}>
			<div className={style["column"]}>
				<div className={style["title"]}>
					<h2> React Grid Draw UI Demo </h2>
				</div>
				<div className={style["button-select-container"]}>
					<button onClick={() => Helper.buildTable(getGridData())}> get grid data</button>
					<button onClick={() => undoLastLine()}> undo last line</button>
					<button onClick={() => undoLastRect()}> undo last rect</button>
				</div>
				<ReactGridDrawUI>
					<div className={style["drawable-container"]} id={"container"}>
						<div>
							<div className={style["test-container"]}>
								<p> test-A </p>
							</div>
							<div className={style["test-container1"]}>
								<p> test-B </p>
							</div>
							<div className={style["test-container1"]}>
								<p> test-C </p>
							</div>
						</div>

						<div>
							<div className={style["test-container"]}>
								<p> test-D </p>
							</div>
							<div className={style["test-container1"]}>
								<p> test-E </p>
							</div>
							<div className={style["test-container1"]}>
								<p> test-F </p>
							</div>
						</div>

						<div>
							<div className={style["test-container"]}>
								<p> test-G </p>
							</div>
							<div className={style["test-container1"]}>
								<p> test-H </p>
							</div>
							<div className={style["test-container1"]}>
								<p> test-I </p>
							</div>
						</div>
					</div>
				</ReactGridDrawUI>
			</div>
			<div className={style["column"]}>
				<table id={"tbody"} />
			</div>
		</div>
	)
};

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);