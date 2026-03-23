import { TileViewComponent } from '../views/TileViewComponent';
import { TileModel } from '../models/TileModel';
import { GridViewComponent } from '../views/GridViewComponent';
import { GridService } from '../services/GridService';
import { GridModel } from '../models/GridModel';
const { ccclass, property } = cc._decorator;

@ccclass('GridControllerComponent')
export class GridControllerComponent extends cc.Component {
    grid: GridModel;
    eventTarget: cc.EventTarget = new cc.EventTarget();

    @property({type: cc.Node})
    background: cc.Node;

    @property({type: cc.Prefab})
    tilePrefab: cc.Prefab;

    _viewMap: Map<TileModel, cc.Node> = new Map<TileModel, cc.Node>();

    _gridService: GridService;

    init(gridService: GridService) {
        this._gridService = gridService;
        this._gridService.eventTarget.on('TileCreated', this.onTileCreated, this);
        this._gridService.eventTarget.on('TileUpdated', this.onTileUpdated, this);
        this._gridService.eventTarget.on('TileRemoved', this.onTileRemoved, this);
    }

    start() {
    }

    createGrid(width: number, height: number) {
        this.grid = new GridModel({
            width: width,
            height: height,
            tiles: this._gridService.createTiles(width, height)
        });

        this.updateBackground();
    }

    clearGrid() {
        this._viewMap.forEach(x => x.destroy());
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
        const group = this._gridService.findConnected(model, this.grid);

        if (group.length >= 2) {
            for (const tile of group) {
                this._gridService.removeTile(tile, this.grid);
            }

            this._gridService.applyGravity(this.grid);
            this._gridService.spawnNewTiles(this.grid);
        }
        
        this.eventTarget.emit('endOfTurn');
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
}


