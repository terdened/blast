import { GameModel } from "../../models/GameModel";
import { ReachTargetScoreCondition } from "./ReachTargetScoreCondition";

export class WinConditionService {
    private _reachTargetScoreCondition: ReachTargetScoreCondition = new ReachTargetScoreCondition();

    check(game: GameModel): boolean {
        return this._reachTargetScoreCondition.check(game);
    }
}