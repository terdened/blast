import { GameState } from "../common/enums/GameState";
import { GameConfig } from "../common/GameConfig";
import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { GameOverConditionService } from "./conditionServices/GameOverConditionService";
import { WinConditionService } from "./conditionServices/WinConditionService";
import { ShuffleGridService } from "./ShuffleGridService";

export class GameService {
    public eventTarget: cc.EventTarget = new cc.EventTarget();
    
    private _gameOverConditionService: GameOverConditionService = new GameOverConditionService();
    private _winConditionService: WinConditionService = new WinConditionService();
    private _shuffleGridService: ShuffleGridService = new ShuffleGridService();

    constructor (private _config: GameConfig) {

    }

    public onEndOfTurn(game: GameModel, grid: GridModel, score: number): void {
        game.remainMoves--;
        game.score += score;

        if (this._shuffleGridService.resolve(grid, game)) {
            this.eventTarget.emit('gridUpdated');
        }

        if (this._winConditionService.check(game)) {
            this.win(game);
            this.eventTarget.emit('win');
        } else if (this._gameOverConditionService.check(grid, game)) {
            this.gameOver(game);
            this.eventTarget.emit('gameOver');
        }
    }

    public startGame (game: GameModel): void {
        game.score = 0;
        game.targetScore = this._config.targetScores;
        game.remainMoves = this._config.maxMoves;
        game.remainShuffleCounts = this._config.maxShuffles;
        game.state = GameState.GS_Play;
    }

    public gameOver (game: GameModel): void {
        game.state = GameState.GS_GameOver;
    }

    public win (game: GameModel): void {
        game.state = GameState.GS_Win;
    }
}