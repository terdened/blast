import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { ITileBehavior } from "./ITileBehavior";

export class HorizontalTileBehavior implements ITileBehavior {
    activate(tile: TileModel, grid: GridModel): TileModel[] {
        const result: TileModel[] = [];

        for (let x = 0; x <= grid.width - 1; x++) {
            if (grid.tiles[tile.position.y]?.[x]) {
                result.push(grid.tiles[tile.position.y][x]);
            }
        }

        return result;
    }
}