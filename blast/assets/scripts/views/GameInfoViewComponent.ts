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

        this.playLastStepsAnimation();
        setTimeout(() => this.playAddScoreAnimation(), 50);
    }

    playAddScoreAnimation() {
        cc.tween(this.scoresLabel.node)
            .to(0.2, {scale: 1.1}, {easing: 'smooth'})
            .to(0.2, {scale: 1}, {easing: 'smooth'})
            .start();
    }
    
    playLastStepsAnimation() {
        if (this.model.remainMoves > 10) {
            return;
        }

        cc.tween(this.remainMovesLabel.node)
            .to(0.2, {scale: 1.4, color: new cc.Color(243, 255, 105)}, {easing: 'smooth'})
            .to(0.2, {scale: 1, color: new cc.Color(255, 255, 255)}, {easing: 'smooth'})
            .start();
    }
}


