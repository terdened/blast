import { TileViewComponent } from '../views/TileViewComponent';
import { TileModel } from '../models/TileModel';
import { GridViewComponent } from '../views/GridViewComponent';
import { GridService } from '../services/grid/GridService';
import { GridModel } from '../models/GridModel';
import { ScoreModel } from '../models/ScoreModel';
import { ScoreViewComponent } from '../views/ScoreViewComponent';
import { GameConstants } from '../common/GameConstants';
import { GridUpdateResult } from '../models/results/GridUpdateResult';
const { ccclass, property } = cc._decorator;

@ccclass
export class GridControllerComponent extends cc.Component {
    public grid: GridModel;
    public eventTarget: cc.EventTarget = new cc.EventTarget();
    public isActive: boolean = true;

    @property({type: cc.Node})
    public background: cc.Node = null;

    @property({type: cc.Prefab})
    public scorePrefab: cc.Prefab = null;

    @property({type: cc.Prefab})
    public tilePrefab: cc.Prefab = null;

    private _viewMap: Map<TileModel, cc.Node> = new Map<TileModel, cc.Node>();
    private _gridService: GridService = new GridService();

    public createGrid(width: number, height: number): void {
        const gridCreateResult = this._gridService.createGrid(width, height);
        this.grid = gridCreateResult.grid;
        this.handleGridUpdateResult(gridCreateResult.updateResult);

        this.updateBackground();
    }

    public clearGrid(): void {
        this._viewMap.forEach(x => x.destroy());
        this._viewMap.clear();
    }

    public redrawTiles(): void {
        this._viewMap.forEach(tile => {
            const tileView = tile.getComponent(TileViewComponent);
            tileView.dirty();
        });
    }

    private calculateTileSpawnHeight(tile: TileModel, newTilesInColumnCount: Map<number, number>): number {
        let columnOffset = newTilesInColumnCount.get(tile.position.x) ?? 0;
        columnOffset++;
        newTilesInColumnCount.set(tile.position.x, columnOffset);
        return 2 * columnOffset * GameConstants.TILE_SIZE + this.grid.height * GameConstants.TILE_SIZE + Math.random() * GameConstants.RANDOM_SPAWN_OFFSET;
    }

    private onTileClicked(tile: TileModel): void {
        if (!this.isActive) {
            return;
        }
        
        const collectTileResult = this._gridService.processTurn(tile, this.grid);
        this.handleGridUpdateResult(collectTileResult.updateResult);

        if (collectTileResult.score > 0) {
            this.spawnScoreView(collectTileResult.score, tile.position);
            this.eventTarget.emit('endOfTurn', collectTileResult.score);
        }
    }

    private spawnScoreView(score: number, position: cc.Vec2): void {
        const scoreModel = new ScoreModel({
            position: position, 
            score: score
        });
        const scoreNode = cc.instantiate(this.scorePrefab);
        this.background.addChild(scoreNode);
    
        let viewComponent = scoreNode.getComponent(ScoreViewComponent);
        viewComponent.init(scoreModel);
    }

    private updateBackground(): void {
        let viewComponent = this.background.getComponent(GridViewComponent);
        viewComponent.init(this.grid);
    }

    private handleGridUpdateResult(updateResult: GridUpdateResult) {
        this.onTilesCreated(updateResult.created);
        this.onTilesUpdated(updateResult.updated);
        this.onTilesRemoved(updateResult.removed);
    }

    private onTilesCreated(tiles: TileModel[]): void {
        let newTilesInColumnCount: Map<number, number> = new Map<number, number>();

        for (let tile of tiles) {
            const tileNode = cc.instantiate(this.tilePrefab);
            this.background.addChild(tileNode);
            
            let viewComponent = tileNode.getComponent(TileViewComponent);
            viewComponent.init(tile);
            viewComponent.setSpawnPosition(this.calculateTileSpawnHeight(tile, newTilesInColumnCount));

            viewComponent.events.on('click', this.onTileClicked, this);

            this._viewMap.set(tile, tileNode);
        }
    }

    private onTilesUpdated(tiles: TileModel[]): void {
        for (let tile of tiles) {
            const tileNode = this._viewMap.get(tile);

            if (tileNode === undefined) {
                continue;
            }

            const tileView = tileNode.getComponent(TileViewComponent);
            tileView.dirty();
        }
    }

    private onTilesRemoved(tiles: TileModel[]): void {
        for (let tile of tiles) {
            const tileNode = this._viewMap.get(tile);

            if (tileNode === undefined) {
                continue;
            }

            tileNode.destroy();
            this._viewMap.delete(tile);
        }
    }
}


