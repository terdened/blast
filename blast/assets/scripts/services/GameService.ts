import { GameState } from "../common/enums/GameState";
import { GameConfig } from "../common/GameConfig";
import { GameModel } from "../models/GameModel";
import { GridModel } from "../models/GridModel";
import { EndOfTurnResultModel } from "../models/results/EndOfTurnResultModel";
import { GameOverConditionService } from "./conditions/GameOverConditionService";
import { WinConditionService } from "./conditions/WinConditionService";
import { ShuffleService } from "./grid/ShuffleService";

export class GameService {
    public eventTarget: cc.EventTarget = new cc.EventTarget();
    
    private _gameOverConditionService: GameOverConditionService = new GameOverConditionService();
    private _winConditionService: WinConditionService = new WinConditionService();
    private _shuffleService: ShuffleService = new ShuffleService();

    constructor (private _config: GameConfig) {

    }

    public handleEndOfTurn(game: GameModel, grid: GridModel, score: number): EndOfTurnResultModel {
        const result = new EndOfTurnResultModel({GameState: GameState.GS_Play});
        
        game.remainMoves--;
        game.score += score;

        result.IsGridUpdated = this._shuffleService.resolve(game, grid);

        if (this._winConditionService.check(game)) {
            this.win(game);
            result.GameState = GameState.GS_Win;
        }

        if (this._gameOverConditionService.check(grid, game)) {
            this.gameOver(game);
            result.GameState = GameState.GS_GameOver;
        }

        return result;
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