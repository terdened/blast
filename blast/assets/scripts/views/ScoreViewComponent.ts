import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { GameConstants } from '../common/GameConstants';
import { ScoreModel } from '../models/ScoreModel';
const { ccclass, property } = cc._decorator;

@ccclass('ScoreViewComponent')
export class ScoreViewComponent extends BaseViewComponent<ScoreModel> {    
    start() {

    }

    dirty() {
        const position = new cc.Vec2(this.model.position.x * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2, this.model.position.y * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2);
        this.node.setPosition(position);

        const label = this.node.getComponent(cc.Label);
        label.string = `+${this.model.score}`;
        
        cc.tween(this.node)
            .by(0.6, {position: new cc.Vec3(0, 200, 0), opacity: -255}, {easing: 'smooth'})
            .start();
        
            
        setTimeout(() => this.node.destroy(), 600);

        this.node.zIndex = 9999;
    }
}
