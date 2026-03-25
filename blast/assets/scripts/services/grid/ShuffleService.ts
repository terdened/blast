import { GameModel } from "../../models/GameModel";
import { GridModel } from "../../models/GridModel";
import { GroupService } from "./GroupService";

export class ShuffleService {
    private _groupService: GroupService = new GroupService();

    public resolve(grid: GridModel, game: GameModel): boolean {
        if(this._groupService.hasMoves(grid)) {
            return false;
        }

        if (game.remainShuffleCounts <= 0) {
            return false;
        }

        game.remainShuffleCounts--;
        this.shuffleGrid(grid);

        return true;
    }

    public shuffleGrid(grid: GridModel): void {
        const flat = grid.flatten();

        for (let i = flat.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flat[i], flat[j]] = [flat[j], flat[i]];
        }

        let index = 0;
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                grid.tiles[y][x] = flat[index++];
                grid.tiles[y][x].position.x = x;
                grid.tiles[y][x].position.y = y;
            }
        }
    }
}