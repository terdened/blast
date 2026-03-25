import { TileType } from "../../common/enums/TileType";
import { GridUpdateResult } from "../../models/results/GridUpdateResult";
import { TileModel } from "../../models/TileModel";

export class BonusService {
    public generateBonus(tile: TileModel, group: TileModel[]): GridUpdateResult {
        const updateResult = new GridUpdateResult();
        if (tile.type === TileType.TT_Color && group.length > 4) {
            const groupSize = this.getGroupSize(group);

            if(group.length > 9) {
                tile.type = TileType.TT_SuperBomb;
            } else if (groupSize.x > groupSize.y) {
                tile.type = TileType.TT_HorizontalRocket;
            } else if(groupSize.y > groupSize.x) {
                tile.type = TileType.TT_VerticalRocket;
            } else {
                tile.type = TileType.TT_Bomb;
            }
            
            updateResult.updated.push(tile);
            group.shift();
        }

        return updateResult;
    }

    public getGroupSize(group: TileModel[]): cc.Vec2 {
        const minX = Math.min(...group.map(_ => _.position.x));
        const minY = Math.min(...group.map(_ => _.position.y));
        const maxX = Math.max(...group.map(_ => _.position.x));
        const maxY = Math.max(...group.map(_ => _.position.y));

        return new cc.Vec2(maxX - minX, maxY - minY);
    }
}