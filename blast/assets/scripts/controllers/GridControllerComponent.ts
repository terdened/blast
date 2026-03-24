import { TileViewComponent } from '../views/TileViewComponent';
import { TileModel } from '../models/TileModel';
import { GridViewComponent } from '../views/GridViewComponent';
import { GridService } from '../services/GridService';
import { GridModel } from '../models/GridModel';
import { ScoreModel } from '../models/ScoreModel';
import { ScoreViewComponent } from '../views/ScoreViewComponent';
const { ccclass, property } = cc._decorator;

@ccclass('GridControllerComponent')
export class GridControllerComponent extends cc.Component {
    grid: GridModel;
    eventTarget: cc.EventTarget = new cc.EventTarget();
    isActive: boolean = true;

    @property({type: cc.Node})
    background: cc.Node;

    @property({type: cc.Prefab})
    scorePrefab: cc.Prefab;

    @property({type: cc.Prefab})
    tilePrefab: cc.Prefab;

    _viewMap: Map<TileModel, cc.Node> = new Map<TileModel, cc.Node>();

    _gridService: GridService;

    init() {
        this._gridService = new GridService();
        this._gridService.eventTarget.on('TileCreated', this.onTileCreated, this);
        this._gridService.eventTarget.on('TileUpdated', this.onTileUpdated, this);
        this._gridService.eventTarget.on('TileRemoved', this.onTileRemoved, this);
    }

    start() {
    }

    createGrid(width: number, height: number) {
        this.grid = this._gridService.createGrid(width, height);
        this.updateBackground();
    }

    clearGrid() {
        this._viewMap.forEach(x => x.destroy());
        this._viewMap.clear();
    }

    onTileCreated(tile: TileModel) {

        const tileNode = cc.instantiate(this.tilePrefab);
        this.background.addChild(tileNode);
        
        let viewComponent = tileNode.getComponent(TileViewComponent);
        viewComponent.init(tile);

        viewComponent.events.on('click', this.onTileClicked, this);

        this._viewMap.set(tile, tileNode);
    }

    onTileClicked(model: TileModel) {
        if (!this.isActive) {
            return;
        }
        
        const score = this._gridService.collectTile(model, this.grid);
        if (score > 0) {
            const scoreModel = new ScoreModel({
                position: model.position, 
                score: score
            });
            const scoreNode = cc.instantiate(this.scorePrefab);
            this.background.addChild(scoreNode);
        
            let viewComponent = scoreNode.getComponent(ScoreViewComponent);
            viewComponent.init(scoreModel);
            
            this.eventTarget.emit('endOfTurn', score);
        }
    }

    onTileUpdated(tile: TileModel) {
        const tileNode = this._viewMap.get(tile);

        if(tile === undefined) {
            return;
        }
        const tileView = tileNode.getComponent(TileViewComponent);
        tileView.dirty();
    }

    onTileRemoved(tile: TileModel) {
        const tileNode = this._viewMap.get(tile);

        if(tile === undefined) {
            return;
        }

        tileNode.destroy();
        this._viewMap.delete(tile);
    }

    updateBackground() {
        let viewComponent = this.background.getComponent(GridViewComponent);
        viewComponent.init(this.grid);
    }

    redrawTiles() {
        this._viewMap.forEach(tile => {
            const tileView = tile.getComponent(TileViewComponent);
            tileView.dirty();
        });
    }
}


