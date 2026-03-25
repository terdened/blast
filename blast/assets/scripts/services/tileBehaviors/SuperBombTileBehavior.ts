import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { GridService } from "../GridService";
import { ITileBehavior } from "./ITileBehavior";

export class SuperBombTileBehavior implements ITileBehavior {
    private _gridService: GridService = new GridService();

    public activate(tile: TileModel, grid: GridModel): TileModel[] {
        return this._gridService.flatten(grid.tiles);
    }
}