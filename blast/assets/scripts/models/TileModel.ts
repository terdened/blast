import { TileColor } from "../common/enums/TileColor";
import { TileType } from "../common/enums/TileType";

export class TileModel {
    public position: cc.Vec2;
    public color: TileColor;
    public type: TileType;

    public constructor(init?:Partial<TileModel>) {
        Object.assign(this, init);
    }
}