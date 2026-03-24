import { GameState } from "../common/enums/GameState";
import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { GameOverConditionService } from "./conditionServices/GameOverConditionService";
import { WinConditionService } from "./conditionServices/WinConditionService";

export class GameService {
    eventTarget: cc.EventTarget = new cc.EventTarget();
    
    private _gameOverConditionService: GameOverConditionService = new GameOverConditionService();
    private _winConditionService: WinConditionService = new WinConditionService();

    onEndOfTurn(game: GameModel, grid: GridModel, score: number) {
        game.remainMoves--;
        game.score += score;

        if (this._winConditionService.check(game)) {
            this.win(game);
            this.eventTarget.emit('win');
        }

        if (this._gameOverConditionService.check(grid, game)) {
            this.gameOver(game);
            this.eventTarget.emit('gameOver');
        }
    }

    startGame (game: GameModel) {
        game.score = 0;
        game.targetScore = 500;
        game.remainMoves = 50;
        game.state = GameState.GS_Play;
    }

    gameOver (game: GameModel) {
        game.state = GameState.GS_GameOver;
    }

    win (game: GameModel) {
        game.state = GameState.GS_Win;
    }
}