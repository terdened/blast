import { GameModel } from "../../models/GameModel";

export class ReachTargetScoreCondition {
    check(game: GameModel): boolean {
        return game.score >= game.targetScore;
    }
}