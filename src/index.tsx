import React, {useState} from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI} from "./components/React-Grid-Draw-UI";

const style = require("./style.module.css");

const App: React.FunctionComponent = () => {

	const [data, setData] = useState<string[][]>();

	return (
		<div>
			<ReactGridDrawUI getGridData={(data: string[][]) => setData(data)} >
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
			<button onClick={() => setData([])}/>
		</div>
	)
};

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
