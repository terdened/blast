import { GridModel } from '../models/GridModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
const { ccclass, property } = cc._decorator;

@ccclass('GridViewComponent')
export class GridViewComponent extends BaseViewComponent<GridModel> {
    private _tileSize: number = 100;

    start() {

    }

    dirty() {
        const anchorPointX = 1 / ((this.model.width + 1) * 2);
        const anchorPointY = 1 / ((this.model.height + 1) * 2);
        this.node.setAnchorPoint(anchorPointX, anchorPointY);

        const width = this.model.width * this._tileSize + this._tileSize;
        const height = this.model.height * this._tileSize + this._tileSize;
        this.node.setContentSize(width, height);

        const xPos = -this.model.width * this._tileSize / 4;
        const yPos = -this.model.height * this._tileSize / 4;
        const newPosition = new cc.Vec2(xPos, yPos);
        this.node.setPosition(newPosition);
    }
}


