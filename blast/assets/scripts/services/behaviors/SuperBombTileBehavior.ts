import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { GridService } from "../grid/GridService";
import { ITileBehavior } from "./ITileBehavior";

export class SuperBombTileBehavior implements ITileBehavior {
    public activate(tile: TileModel, grid: GridModel): TileModel[] {
        return grid.flatten();
    }
}