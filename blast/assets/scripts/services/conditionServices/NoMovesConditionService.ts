import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { GridService } from "../GridService";
import { IBaseConditionService } from "./IBaseConditionService";

export class NoMovesConditionService implements IBaseConditionService {
    private _gridService: GridService = new GridService();

    check(grid: GridModel): boolean {
        const visited = new Set<string>();

        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const key = `${x}_${y}`;

                if (visited.has(key)) continue;

                const group = this.findGroup(x, y, visited, grid);

                if (group.length >= 2) {
                    return false;
                }
            }
        }

        return true;
    }

    findGroup(startX: number, startY: number, visited: Set<string>, grid: GridModel): TileModel[] {

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

            const neighbors = this._gridService.getNeighbors(tile, grid);

            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }
}