import { GameState } from "../common/enums/GameState";
import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { GameOverConditionService } from "./GameOverConditionService";

export class GameService {

    constructor(private _gameOverConditionService: GameOverConditionService) {

    }

    onEndOfTurn(game: GameModel, grid: GridModel) {
        game.currentTurn++;
        if (this._gameOverConditionService.check(grid)) {
            this.gameOver(game);
        }
    }

    startGame (game: GameModel) {
        game.score = 0;
        game.state = GameState.GS_Play;
    }

    gameOver (game: GameModel) {
        game.state = GameState.GS_GameOver;
    }
}