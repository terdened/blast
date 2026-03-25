import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { GridService } from "../GridService";
import { ITileBehavior } from "./ITileBehavior";

export class ColorTileBehavior implements ITileBehavior {
    private _gridService: GridService = new GridService();

    activate(tile: TileModel, grid: GridModel): TileModel[] {
        return this.findConnected(tile, grid);
    }

    findConnected(startTile: TileModel, grid: GridModel): TileModel[] {
        const stack: TileModel[] = [startTile];
        const visited = new Set<string>();
        const result: TileModel[] = [];

        const targetColor = startTile.color;

        while (stack.length > 0) {
            const tile = stack.pop()!;
            const key = `${tile.position.x}_${tile.position.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (tile.color !== targetColor) continue;

            result.push(tile);

            const neighbors = this._gridService.getNeighbors(tile, grid);
            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }
}