// NOTE: This class is just for demo purposes
export class Helper {

	static buildTable = (grids: string[][][]) => {
		let tbody = document.getElementById('tbody') as HTMLElement;
		tbody.innerHTML = "";
		for (let gridIndex = 0; gridIndex < grids.length; gridIndex++) {
			let grid = grids[gridIndex];
			tbody.innerHTML += "<h2> Table: " + (gridIndex + 1) + "</h2";
			tbody.innerHTML += "<table>";
			for (let i = 0; i < grid.length; i++) {
				let val: string[] = grid[i] as string[];
				let tr = "<tr>";
				for (let item of val) {
					tr += Helper.buildHtmlTableCellFromMapRow(item);
				}
				tr += "</tr>";
				tbody.innerHTML += tr;
			}
			tbody.innerHTML += "</table> <br>";
		}
	}

	private static buildHtmlTableCellFromMapRow = (item: string) => {
		return "<td>" + item.toString() + "</td>";
	}
}