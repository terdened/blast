import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { GridService } from "../GridService";
import { ITileBehavior } from "./ITileBehavior";

export class SuperBombTileBehavior implements ITileBehavior {
    gridService: GridService = new GridService();

    activate(tile: TileModel, grid: GridModel): TileModel[] {
        return this.gridService.flatten(grid.tiles);
    }
}