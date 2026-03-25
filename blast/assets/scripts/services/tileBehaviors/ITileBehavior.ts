import { GridModel } from "../../models/GridModel";
import { TileModel } from "../../models/TileModel";
import { GridService } from "../GridService";

export interface ITileBehavior {
    activate(tile: TileModel, grid: GridModel): TileModel[];
}