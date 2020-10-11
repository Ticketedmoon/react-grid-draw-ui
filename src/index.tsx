import React from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI} from "./components/React-Grid-Draw-UI";
import {useGridData} from "./components/React-Grid-Draw-UI/hooks/useGridData";

const style = require("./style.module.css");

const App: React.FunctionComponent = () => {

	const getGridData: (() => () => string[][]) = useGridData(null);

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
					</div>

					<div>
						<div className={style["test-container"]}>
							<p> test-C </p>
						</div>
						<div className={style["test-container1"]}>
							<p> test-D </p>
						</div>
					</div>

					<div>
						<div className={style["test-container"]}>
							<p> test-E </p>
						</div>
						<div className={style["test-container1"]}>
							<p> test-F </p>
						</div>
					</div>
				</div>
			</ReactGridDrawUI>
			<button onClick={() => console.log(getGridData())}> test </button>
		</div>
	)
};

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
