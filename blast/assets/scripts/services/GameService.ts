import { GameState } from "../common/enums/GameState";
import { GameConfig } from "../common/GameConfig";
import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { GameOverConditionService } from "./conditionServices/GameOverConditionService";
import { WinConditionService } from "./conditionServices/WinConditionService";
import { ShuffleGridService } from "./ShuffleGridService";

export class GameService {
    eventTarget: cc.EventTarget = new cc.EventTarget();
    
    private _gameOverConditionService: GameOverConditionService = new GameOverConditionService();
    private _winConditionService: WinConditionService = new WinConditionService();
    private _shuffleGridService: ShuffleGridService = new ShuffleGridService();

    constructor (private _config: GameConfig) {

    }

    onGridShuffled () {
    }

    onEndOfTurn(game: GameModel, grid: GridModel, score: number) {
        game.remainMoves--;
        game.score += score;

        if (this._shuffleGridService.resolve(grid, game)) {
        this.eventTarget.emit('gridShuffled');
        }

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
        game.targetScore = this._config.targetScores;
        game.remainMoves = this._config.maxMoves;
        game.remainShuffleCounts = this._config.maxShuffles;
        game.state = GameState.GS_Play;
    }

    gameOver (game: GameModel) {
        game.state = GameState.GS_GameOver;
    }

    win (game: GameModel) {
        game.state = GameState.GS_Win;
    }
}