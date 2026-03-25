import { GridModel } from "../../models/GridModel";
import { GridService } from "../GridService";

export class NoMovesConditionService {
    private _gridService: GridService = new GridService();

    public check(grid: GridModel): boolean {
        if(this._gridService.hasMoves(grid)) {
            return false;
        }

        return true;
    }
}