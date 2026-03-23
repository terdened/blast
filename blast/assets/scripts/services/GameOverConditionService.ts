import { GridService } from "./GridService";
import { IBaseConditionService } from "./IBaseConditionService";
import { NoMovesConditionService } from "./NoMovesConditionService";

export class GameOverConditionService implements IBaseConditionService {

    private _noMovesConditionService: NoMovesConditionService;

    constructor(_gridService: GridService) {
        this._noMovesConditionService = new NoMovesConditionService(_gridService);
    }

    check(): boolean {
        return this._noMovesConditionService.check();
    }
}