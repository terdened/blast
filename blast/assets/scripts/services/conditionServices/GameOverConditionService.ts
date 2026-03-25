import { GameModel } from "../../models/GameModel";
import { GridModel } from "../../models/GridModel";
import { NoMovesConditionService } from "./NoMovesConditionService";
import { OutOfTurnsConditionService } from "./OutOfTurnsConditionService";

export class GameOverConditionService {
    private _noMovesConditionService: NoMovesConditionService = new NoMovesConditionService();
    private _outOfTurnsConditionService: OutOfTurnsConditionService = new OutOfTurnsConditionService();

    public check(grid: GridModel, game: GameModel): boolean {
        return this._noMovesConditionService.check(grid) || this._outOfTurnsConditionService.check(game);
    }
}