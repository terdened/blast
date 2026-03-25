import { TileType } from "../../common/enums/TileType";
import { BombTileBehavior } from "./BombTileBehavior";
import { ColorTileBehavior } from "./ColorTileBehavior";
import { HorizontalTileBehavior } from "./HorizontalTileBehavior";
import { ITileBehavior } from "./ITileBehavior";
import { SuperBombTileBehavior } from "./SuperBombTileBehavior";
import { VerticalTileBehavior } from "./VerticalTileBehavior";

export class TileBehaviorFactory {
    public get(type: TileType): ITileBehavior {
        switch (type) {
            case TileType.TT_Color: return new ColorTileBehavior();
            case TileType.TT_HorizontalRocket: return new HorizontalTileBehavior();
            case TileType.TT_VerticalRocket: return new VerticalTileBehavior();
            case TileType.TT_Bomb: return new BombTileBehavior();
            case TileType.TT_SuperBomb: return new SuperBombTileBehavior();
            default: return new ColorTileBehavior();
        }
    }
}