import { GameState } from "../common/enums/GameState";
import { GameConfig } from "../common/GameConfig";
import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { GameOverConditionService } from "./conditions/GameOverConditionService";
import { WinConditionService } from "./conditions/WinConditionService";

export class GameService {
    public eventTarget: cc.EventTarget = new cc.EventTarget();
    
    private _gameOverConditionService: GameOverConditionService = new GameOverConditionService();
    private _winConditionService: WinConditionService = new WinConditionService();

    constructor (private _config: GameConfig) {

    }

    public handleEndOfTurn(game: GameModel, grid: GridModel, score: number): GameState {
        game.remainMoves--;
        game.score += score;

        if (this._winConditionService.check(game)) {
            this.win(game);
            return GameState.GS_Win;
        } 

        if (this._gameOverConditionService.check(grid, game)) {
            this.gameOver(game);
            return GameState.GS_GameOver;
        }

        return GameState.GS_Play;
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