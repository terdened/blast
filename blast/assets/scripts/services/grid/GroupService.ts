import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";

export class GroupService {
    public hasMoves(grid: GridModel): boolean {
        const visited = new Set<string>();

        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const key = `${x}_${y}`;

                if (visited.has(key)) continue;

                const group = this.findGroup(x, y, visited, grid);

                if (group.length >= 2) {
                    return true;
                }
            }
        }

        return false;
    }

    public findGroup(startX: number, startY: number, visited: Set<string>, grid: GridModel): TileModel[] {

        const stack: TileModel[] = [grid.tiles[startY][startX]];
        const result: TileModel[] = [];
        const color = grid.tiles[startY][startX].color;

        while (stack.length > 0) {
            const tile = stack.pop()!;
            const key = `${tile.position.x}_${tile.position.y}`;

            if (visited.has(key)) continue;
            
            if (tile.color !== color) continue;

            visited.add(key);

            result.push(tile);

            const neighbors = this.getNeighbors(tile, grid);

            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }
    
    public getNeighbors(tile: TileModel, grid: GridModel): TileModel[] {
        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
        ];

        const result: TileModel[] = [];

        for (const d of dirs) {
            const nx = tile.position.x + d.x;
            const ny = tile.position.y + d.y;

            if (grid.tiles[ny] && grid.tiles[ny][nx]) {
                result.push(grid.tiles[ny][nx]);
            }
        }

        return result;
    }
}