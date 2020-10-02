import React from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI} from "./components/React-Grid-Draw-UI";

const style = require("./style.module.css");

const App: React.FunctionComponent = () => {
	return (
		<div>
			<ReactGridDrawUI>
				<div className={style["drawable-container"]} id={"drawable-container"}>
					<div>
						<div className={style["test-container"]}>
							<p> test</p>
						</div>
						<div className={style["test-container1"]}>
							<p> test</p>
						</div>
					</div>
				</div>
			</ReactGridDrawUI>
		</div>
	)
};

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
