import { TileModel } from "./TileModel";

export class GridModel {
    public width: number;
    public height: number;

    public tiles: TileModel[][];

    public constructor(init?:Partial<GridModel>) {
        Object.assign(this, init);
    }
}