import { GameConstants } from "../../common/GameConstants";
import { GridModel } from "../../models/GridModel";

export class GridLayoutService {
    public getTilePosition(position: cc.Vec2): cc.Vec2 {
        return new cc.Vec2(
            position.x * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2,
            position.y * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2
        );
    }

    public getGridSize(width: number, height: number): cc.Vec2 {
        return new cc.Vec2(
            width * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE,
            height * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE
        );
    }

    public getGridAnchor(width: number, height: number): cc.Vec2 {
        return new cc.Vec2(
            1 / ((width + 1) * 2),
            1 / ((height + 1) * 2)
        );
    }

    public getGridPosition(width: number, height: number): cc.Vec2 {
        return new cc.Vec2(
            -width * GameConstants.TILE_SIZE / 4,
            -height * GameConstants.TILE_SIZE / 4
        );
    }

    public getTileSpawnPosition(position: cc.Vec2, newTilesInColumnCount: Map<number, number>, grid: GridModel): cc.Vec2 {
        let columnOffset = newTilesInColumnCount.get(position.x) ?? 0;
        columnOffset++;
        newTilesInColumnCount.set(position.x, columnOffset);

        return new cc.Vec2(
            position.x * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2,
            2 * columnOffset * GameConstants.TILE_SIZE + grid.height * GameConstants.TILE_SIZE + Math.random() * GameConstants.RANDOM_SPAWN_OFFSET
        );
    }
}