import { GameModel } from '../models/GameModel';
import { GridControllerComponent } from './GridControllerComponent';
import { GameService } from '../services/GameService';
import { GameInfoViewComponent } from '../views/GameInfoViewComponent';
import { GameConfig } from '../common/GameConfig';
const { ccclass, property } = cc._decorator;

@ccclass
export class GameControllerComponent extends cc.Component {
    @property({type: GameInfoViewComponent})
    public gameInfoView: GameInfoViewComponent = null;

    @property({type: GridControllerComponent})
    public gridController: GridControllerComponent = null;

    @property({type: cc.Node})
    public gameOverPanel: cc.Node = null;

    @property({type: cc.Node})
    public winPanel: cc.Node = null;

    private _game: GameModel = new GameModel();
    private _config: GameConfig;
    private _gameService: GameService;

    protected async onEnable(): Promise<void> {
        this._config = await this.loadConfig();

        this._gameService = new GameService(this._config);
        this._gameService.eventTarget.on('gridUpdated', this.onGridUpdated, this);
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
        this._gameService.onEndOfTurn(this._game, this.gridController.grid, score);
        this.gameInfoView.dirty();
    }

    private onWin(): void {
        this.winPanel.active = true;
        this.gridController.isActive = false;
    }

    private onGameOver(): void {
        this.gameOverPanel.active = true;
        this.gridController.isActive = false;
    }

    private onGridUpdated(): void {
        this.gridController.redrawTiles();
    }

    private newGame(): void {
        this.gridController.isActive = true;
        this.gridController.clearGrid();
        this._gameService.startGame(this._game);
        this.gridController.createGrid(this._config.gridWidth, this._config.gridHeight);

        this.gameOverPanel.active = false;
        this.winPanel.active = false;
        this.gameInfoView.init(this._game);
    }
}