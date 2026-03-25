import { GameModel } from '../models/GameModel';
import { GridControllerComponent } from './GridControllerComponent';
import { GameService } from '../services/GameService';
import { GameInfoViewComponent } from '../views/GameInfoViewComponent';
import { GameConfig } from '../common/GameConfig';
import { ShuffleService } from '../services/grid/ShuffleService';
import { GameState } from '../common/enums/GameState';
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
    private _shuffleGridService: ShuffleService = new ShuffleService();

    protected async onEnable(): Promise<void> {
        this._config = await this.loadConfig();

        this._gameService = new GameService(this._config);

        this.gridController.eventTarget.on('endOfTurn', this.onEndOfTurn, this);

        this._shuffleGridService = new ShuffleService();

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
        if (this._shuffleGridService.resolve(this.gridController.grid, this._game)) {
            this.gridController.redrawTiles();
        }

        const gameState = this._gameService.handleEndOfTurn(this._game, this.gridController.grid, score);
        this.gameInfoView.dirty();

        if (gameState === GameState.GS_Win) {
            this.win();
        }

        if (gameState === GameState.GS_GameOver) {
            this.gameOver();
        }
    }

    private win(): void {
        this.winPanel.active = true;
        this.gridController.isActive = false;
    }

    private gameOver(): void {
        this.gameOverPanel.active = true;
        this.gridController.isActive = false;
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