import { GridModel } from '../models/GridModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { GameConstants } from '../common/GameConstants';
const { ccclass } = cc._decorator;

@ccclass('GridViewComponent')
export class GridViewComponent extends BaseViewComponent<GridModel> {
    start() {

    }

    dirty() {
        const anchorPointX = 1 / ((this.model.width + 1) * 2);
        const anchorPointY = 1 / ((this.model.height + 1) * 2);
        this.node.setAnchorPoint(anchorPointX, anchorPointY);

        const width = this.model.width * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE;
        const height = this.model.height * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE;
        this.node.setContentSize(width, height);

        const xPos = -this.model.width * GameConstants.TILE_SIZE / 4;
        const yPos = -this.model.height * GameConstants.TILE_SIZE / 4;
        const newPosition = new cc.Vec2(xPos, yPos);
        this.node.setPosition(newPosition);
    }
}


