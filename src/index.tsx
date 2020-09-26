import React from "react";
import ReactDOM from "react-dom";
import {ReactGridDrawUI} from "./components/React-Grid-Draw-UI";

const App: React.FunctionComponent = () => {
    return (
        <ReactGridDrawUI/>
    )
};

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
