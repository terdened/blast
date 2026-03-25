import { GridModel } from "../../models/GridModel";
import { GridUpdateResult } from "../../models/results/GridUpdateResult";
import { TileModel } from "../../models/TileModel";

export class GravityService {
    public applyGravity(grid: GridModel): GridUpdateResult {
        const updateResult = new GridUpdateResult();
        for (let x = 0; x < grid.width; x++) {
            let emptyY = 0;

            for (let y = 0; y < grid.height; y++) {
                const tile = grid.tiles[y][x];

                if (tile !== undefined) {
                    if (y !== emptyY) {
                        this.moveTile(tile, x, emptyY, grid);
                        updateResult.updated.push(tile);
                    }

                    emptyY++;
                }
            }
        }

        return updateResult;
    }

    public moveTile(tile: TileModel, x: number, y: number, grid: GridModel): void {
        grid.tiles[y][x] = tile;
        grid.tiles[tile.position.y][tile.position.x] = undefined;

        tile.position.x = x;
        tile.position.y = y;
    }
}