import { GameModel } from '../models/GameModel';
import { GridControllerComponent } from './GridControllerComponent';
import { GameService } from '../services/GameService';
import { GameInfoViewComponent } from '../views/GameInfoViewComponent';
import { GameConfig } from '../common/GameConfig';
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
    config: GameConfig;

    private _gameService: GameService;

    protected async onEnable(): Promise<void> {
        this.config = await this.loadConfig();

        this._gameService = new GameService(this.config);
        this._gameService.eventTarget.on('gridShuffled', this.onGridShuffled, this);
        this._gameService.eventTarget.on('gameOver', this.onGameOver, this);
        this._gameService.eventTarget.on('win', this.onWin, this);

        this.gridController.init();
        this.gridController.eventTarget.on('endOfTurn', this.onEndOfTurn, this);
        
        this.newGame();
    }

    private loadConfig(): Promise<GameConfig> {
        return new Promise((resolve, reject) => {
            cc.resources.load('config', (err, asset: cc.JsonAsset) => {
                if (err) reject(err);
                else resolve(asset.json as GameConfig);
            });
        });
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

    private onGridShuffled(): void {
        this.gridController.redrawTiles();
    }

    private newGame(): void {
        this.gridController.clearGrid();
        this._gameService.startGame(this.game);
        this.gridController.createGrid(this.config.gridWidth, this.config.gridHeight);

        this.gameOverPanel.active = false;
        this.winPanel.active = false;
        this.gameInfoView.init(this.game);
    }
}