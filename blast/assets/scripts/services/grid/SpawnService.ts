import { TileColor } from "../../common/enums/TileColor";
import { TileType } from "../../common/enums/TileType";
import { GridModel } from "../../models/GridModel";
import { GridUpdateResult } from "../../models/results/GridUpdateResult";
import { TileModel } from "../../models/TileModel";

export class SpawnService {
    public initTiles(grid: GridModel): GridUpdateResult {
        const updateResult = new GridUpdateResult();

        for (var y = 0; y < grid.height; y++)
        {
            let row: TileModel[] = [];
            
            for (var x = 0; x < grid.width; x++)
            {
                const tile = this.createTile(x, y);
                row.push(tile);
                updateResult.created.push(tile);
            }

            grid.tiles.push(row);
        }

        return updateResult;
    }

    public fillEmptyCells(grid: GridModel): GridUpdateResult {
        const updateResult = new GridUpdateResult();

        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                if (grid.tiles[y][x] === undefined) {
                    const tileModel = this.createTile(x, y);
                    grid.tiles[y][x] = tileModel;
                    updateResult.created.push(tileModel);
                }
            }
        }

        return updateResult;
    }
    
    public createTile(x: number, y: number): TileModel {
        const randomColor = Math.floor(Math.random() * 5);
        const tile = new TileModel({
            position: new cc.Vec2(x, y),
            type: TileType.TT_Color,
            color: randomColor as TileColor
        });

        return tile;
    }
}