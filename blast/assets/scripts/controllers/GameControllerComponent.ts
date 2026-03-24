import { GameModel } from '../models/GameModel';
import { GridControllerComponent } from './GridControllerComponent';
import { GameService } from '../services/GameService';
import { GameInfoViewComponent } from '../views/GameInfoViewComponent';
const { ccclass, property } = cc._decorator;

@ccclass('GameControllerComponent')
export class GameControllerComponent extends cc.Component {
    @property({type: GameInfoViewComponent})
    gameInfoView: GameInfoViewComponent;

    @property({type: GridControllerComponent})
    gridController: GridControllerComponent;

    @property({type: cc.Node})
    gameOverPanel: cc.Node;

    @property({type: cc.Node})
    winPanel: cc.Node;

    game: GameModel = new GameModel();

    private _gameService: GameService;

    protected onEnable(): void {
        this._gameService = new GameService();
        this._gameService.eventTarget.on('gameOver', this.onGameOver, this);
        this._gameService.eventTarget.on('win', this.onWin, this);

        this.gridController.init();
        this.gridController.eventTarget.on('endOfTurn', this.onEndOfTurn, this);
    }

    protected start(): void {
        this.newGame();
    }

    private onEndOfTurn(score: number): void {
        this._gameService.onEndOfTurn(this.game, this.gridController.grid, score);
        this.gameInfoView.dirty();
    }

    private onWin(): void {
        this.winPanel.active = true;
    }

    private onGameOver(): void {
        this.gameOverPanel.active = true;
    }

    private newGame(): void {
        this.gridController.clearGrid();
        this._gameService.startGame(this.game);
        this.gridController.createGrid(4, 6);

        this.gameOverPanel.active = false;
        this.winPanel.active = false;
        this.gameInfoView.init(this.game);
    }
}