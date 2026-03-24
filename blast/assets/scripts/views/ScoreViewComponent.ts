import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { ScoreModel } from '../models/ScoreModel';
const { ccclass, property } = cc._decorator;

@ccclass('ScoreViewComponent')
export class ScoreViewComponent extends BaseViewComponent<ScoreModel> {    
    _tileSize: number = 100;
    
    start() {

    }

    dirty() {
        const position = new cc.Vec2(this.model.position.x * this._tileSize + this._tileSize / 2, this.model.position.y * this._tileSize + this._tileSize / 2);
        this.node.setPosition(position);

        const label = this.node.getComponent(cc.Label);
        label.string = `+${this.model.score}`;
        
        cc.tween(this.node)
            .by(0.4, {position: new cc.Vec3(0, 200, 0), opacity: -255}, {easing: 'smooth'})
            .start();
        
            
        setTimeout(() => this.node.destroy(), 400);

        this.node.zIndex = 9999;
    }
}
