import { TileModel } from "./TileModel";

export class GridModel {
    public width: number;
    public height: number;

    public tiles: TileModel[][];

    public constructor(init?:Partial<GridModel>) {
        Object.assign(this, init);
    }

    public flatten(): TileModel[] {
        const result: TileModel[] = [];

        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                result.push(this.tiles[y][x]);
            }
        }

        return result;
    }
}