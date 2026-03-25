import { GridModel } from '../../models/GridModel';
import { TileModel } from '../../models/TileModel';
import { TileBehaviorFactory } from '../behaviors/TileBehaviorFactory';
import { GravityService } from './GravityService';
import { BonusService } from './BonusService';
import { SpawnService } from './SpawnService';
import { CollectTileResultModel } from '../../models/results/CollectTileResultModel';
import { CreateGridResultModel } from '../../models/results/CreateGridResultModel';
import { GridUpdateResult } from '../../models/results/GridUpdateResult';

export class GridService {
    private _gravityService: GravityService = new GravityService();
    private _bonusService: BonusService = new BonusService();
    private _spawnService: SpawnService = new SpawnService();
    private _tileBehaviorFactory: TileBehaviorFactory = new TileBehaviorFactory();

    public createGrid(width: number, height: number): CreateGridResultModel {
        let grid = new GridModel({
            width: width,
            height: height,
            tiles: []
        });

        const result = new CreateGridResultModel({
            grid: grid, 
            updateResult: this._spawnService.initTiles(grid)
        });

        return result;
    }

    public removeTile(tile: TileModel, grid: GridModel): void {
        if(tile === undefined) {
            return;
        }

        grid.tiles[tile.position.y][tile.position.x] = undefined;
    }

    public removeTiles(tiles: TileModel[], grid: GridModel): GridUpdateResult {
        const result = new GridUpdateResult();

        for (const item of tiles) {
            this.removeTile(item, grid);
            result.removed.push(item);
        }

        return result;
    }

    public processTurn(tile: TileModel, grid: GridModel): CollectTileResultModel {
        const behavior = this._tileBehaviorFactory.get(tile.type);
        const group = behavior.activate(tile, grid);
        if (group.length < 2) {
            return;
        }

        const result = new CollectTileResultModel();
        result.score = group.length * 5;
        result.updateResult.append(this._bonusService.generateBonus(tile, group));
        result.updateResult.append(this.removeTiles(group, grid));
        result.updateResult.append(this._gravityService.applyGravity(grid));
        result.updateResult.append(this._spawnService.fillEmptyCells(grid));

        return result;
    }
}


