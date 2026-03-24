import { GridModel } from "../../models/GridModel";
import { GridService } from "../GridService";
import { IBaseConditionService } from "./IBaseConditionService";

export class NoMovesConditionService implements IBaseConditionService {

    private _gridService: GridService = new GridService();

    check(grid: GridModel): boolean {
        if(this._gridService.hasMoves(grid)) {
            return false;
        }

        return true;
    }
}