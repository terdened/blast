import { TileModel } from "./TileModel";

export class GridModel {
    width: number;
    height: number;

    tiles: TileModel[][];

    public constructor(init?:Partial<GridModel>) {
        Object.assign(this, init);
    }
}