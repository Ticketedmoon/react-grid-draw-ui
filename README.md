[![NPM](https://nodei.co/npm/react-grid-draw-ui.png)](https://npmjs.org/package/react-grid-draw-ui) <br><br>
[![npm version](https://badge.fury.io/js/react-grid-draw-ui.svg)](https://badge.fury.io/js/react-grid-draw-ui)
[![install size](https://packagephobia.com/badge?p=react-grid-draw-ui@1.0.8)](https://packagephobia.com/result?p=react-grid-draw-ui@1.0.8)

# React Grid Draw UI

A sophisticated canvas-based drawing and grid-creation React component library.

**Demo:** https://shanecreedon.github.io/React-grid-draw-ui/

**Prerequisites**
- React version >= 16.8 (For hooks)

**Features Include:**  
- Drawing a box on a given react page using simple mouse drag and clicks.
- Selecting points along the border of the box to indicate columns/rows for a particular grid.
- Adjustable grid colour, box line width, circle-hover-on-border size, circle-border-shift distance, 
border-box mouse tolerance via props - **More to be added**.
- Multiple Grid Creation - You can draw multiple grids and retrieve data from those multiple grids with a function call.
- Simplicity - Simply just wrap any div with the `<ReactGridDrawUI>` component, and it should work out of the box.
- File support - This library supports both **jsx** and **tsx**.

# Installing and usage

Install react-grid-draw-ui from npm with the following command.  

``
npm install react-grid-draw-ui
`` 

Then use it in your app:

```jsx
import React, {FunctionComponent} from "react";

import {ReactGridDrawUI, useGridData} from "react-grid-draw-ui";


const App = () => {

	const [getGridData, removeLastGrid, removeLastDrawnGridLine] = useGridData();

	return (
		<div>
			<div className={"title"}>
				<h2> React Grid Draw UI NPM Library Demoo </h2>
			</div>
			<ReactGridDrawUI>
				<div id={"container"}>
					<div>
						<div className={"test-container"}>
							<p> test-A </p>
						</div>
						<div className={"test-container1"}>
							<p> test-B </p>
						</div>
						<div className={"test-container1"}>
							<p> test-C </p>
						</div>
					</div>
				</div>
			</ReactGridDrawUI>
			<button onClick={() => console.log(getGridData())}> Get Grid Data </button>
			<button onClick={() => removeLastGrid()}> Remove last drawn grid </button>
			<button onClick={() => removeLastDrawnGridLine()}> Remove last drawn grid line </button>
		</div>
	)
};
```

**Note:** Currently it is required for the div wrapped by `<ReactGridDrawUI>` to contain an `id` attribute. This can be any ID. 
It must have a value as per how the tool currently works. Follow the example above for clarity.

## Props

You can control the following props by providing values for them. If you don't, react-grid-draw-ui will manage and default them for you.

- `lineClickTolerance` - Specifies how far away from the border of the grid can the user click to place a grid line. 
- `selectCircleSize` - Specifies the size of the circle that appears on-hover of the border of a particular grid. 
- `circleLineShiftSize` - Specifies the rigidity of the mouse line-detection on the border - lower values will appear smoother, 
higher values will appear more rigid.
- `contextLineWidth` - Specifies the size of the grid lines and on-hover grid lines.
- `lineColour` - Specifies the colour of the drawn grids. 

## Default prop values

- `lineClickTolerance`: 15
- `selectCircleSize`: 3
- `circleLineShiftSize`: 10
- `contextLineWidth`: 1
- `lineColour`: "red" (**Note:** You can specify string literals or hex values here)

## Public Facing library functions 

`react-grid-draw-ui` exposes 2 elements publicly:

- `<ReactGridDrawUI>` - The Wrapper component showed in the example above. 
- `useGridData()` - A custom hook for getting grid data or using the function suite we provide - see example above.

## Support

For any **contributions** or **feature requests**, please head over to the project [Github](https://github.com/ShaneCreedon/React-grid-draw-ui)
and check out the contribution guide lines or put in an issue for areas where you think the project can be improved.

## Thanks

A large thank you to all of those involved and supporting the project. 


## License
 
MIT Licensed. Copyright (c) Shane Creedon 2020.