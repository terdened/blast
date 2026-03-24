import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { GameModel } from '../models/GameModel';
const { ccclass, property } = cc._decorator;

@ccclass('GameInfoViewComponent')
export class GameInfoViewComponent extends BaseViewComponent<GameModel> {
    @property({type: cc.Label})
    remainMovesLabel: cc.Label;

    @property({type: cc.Label})
    scoresLabel: cc.Label;
    
    start() {

    }

    dirty() {
        this.remainMovesLabel.string = this.model.remainMoves.toString();
        this.scoresLabel.string = `${this.model.score}/${this.model.targetScore}`;
        this.playAddScoreAnimation();
    }

    playAddScoreAnimation() {
        cc.tween(this.scoresLabel.node)
            .to(0.2, {scale: 1.1}, {easing: 'smooth'})
            .to(0.2, {scale: 1}, {easing: 'smooth'})
            .start();
    }
}


