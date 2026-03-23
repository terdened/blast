import { TileColor } from "../common/enums/TileColor";

export class TileModel {
    position: cc.Vec2;
    color: TileColor;

    public constructor(init?:Partial<TileModel>) {
        Object.assign(this, init);
    }
}