import { TileColor } from "../common/enums/TileColor";
import { TileType } from "../common/enums/TileType";

export class TileModel {
    position: cc.Vec2;
    color: TileColor;
    type: TileType;

    public constructor(init?:Partial<TileModel>) {
        Object.assign(this, init);
    }
}