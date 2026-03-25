import { GridModel } from "../../models/GridModel";
import { GroupService } from "../grid/GroupService";

export class NoMovesConditionService {
    private _groupService: GroupService = new GroupService();

    public check(grid: GridModel): boolean {
        if(this._groupService.hasMoves(grid)) {
            return false;
        }

        return true;
    }
}