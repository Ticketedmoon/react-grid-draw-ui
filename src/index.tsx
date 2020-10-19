import React from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI} from "./components/React-Grid-Draw-UI";
import {useGridData} from "./components/React-Grid-Draw-UI/hooks/useGridData";

const style = require("./style.module.css");

const App: React.FunctionComponent = () => {

	const [getGridData, undoLastRect, undoLastLine]: Function[] = useGridData();

	return (
		<div>
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
			<button onClick={() => console.log(getGridData())}> test </button>
			<button onClick={() => undoLastLine()}> undo last line </button>
			<button onClick={() => undoLastRect()}> undo last rect </button>
		</div>
	)
};

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
