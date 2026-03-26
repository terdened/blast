import { GridModel } from '../models/GridModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { GridLayoutService } from '../services/grid/GridLayoutService';
const { ccclass } = cc._decorator;

@ccclass
export class GridViewComponent extends BaseViewComponent<GridModel> {
    private _gridLayoutService: GridLayoutService = new GridLayoutService();

    public dirty(): void {
        const anchor = this._gridLayoutService.getGridAnchor(this.model.width, this.model.height);
        this.node.setAnchorPoint(anchor.x, anchor.y);

        const size = this._gridLayoutService.getGridSize(this.model.width, this.model.height);
        this.node.setContentSize(size.x, size.y);

        const position = this._gridLayoutService.getGridPosition(this.model.width, this.model.height);
        this.node.setPosition(position);
    }
}