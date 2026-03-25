import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { ITileBehavior } from "./ITileBehavior";

export class VerticalTileBehavior implements ITileBehavior {
    activate(tile: TileModel, grid: GridModel): TileModel[] {
        const result: TileModel[] = [];

        for (let y = 0; y <= grid.height - 1; y++) {
            if (grid.tiles[y]?.[tile.position.x]) {
                result.push(grid.tiles[y][tile.position.x]);
            }
        }

        return result;
    }
}