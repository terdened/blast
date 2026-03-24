import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { GridService } from "./GridService";


export class ShuffleGridService {
    private _gridService: GridService = new GridService();

    resolve(grid: GridModel, game: GameModel): boolean {
        if(this._gridService.hasMoves(grid)) {
            return false;
        }

        if (game.remainShuffleCounts <= 0) {
            return false;
        }

        game.remainShuffleCounts--;
        this._gridService.shuffleGrid(grid);

        return true;
    }
}