import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { ITileBehavior } from "./ITileBehavior";

export class BombTileBehavior implements ITileBehavior {
    activate(tile: TileModel, grid: GridModel): TileModel[] {
        const result: TileModel[] = [];

        for (let y = tile.position.y - 1; y <= tile.position.y + 1; y++) {
            for (let x = tile.position.x - 1; x <= tile.position.x + 1; x++) {
                if (grid.tiles[y]?.[x]) {
                    result.push(grid.tiles[y][x]);
                }
            }
        }

        return result;
    }
}