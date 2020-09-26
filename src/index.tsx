import React from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI} from "./components/React-Grid-Draw-UI";

const App: React.FunctionComponent = () => {
    return (
        <div>
            <ReactGridDrawUI/>
        </div>
    )
};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
