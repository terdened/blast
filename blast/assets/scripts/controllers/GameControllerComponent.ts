import { GameModel } from '../models/GameModel';
import { TileModel } from '../models/TileModel';
import { GridControllerComponent } from './GridControllerComponent';
import { GridService } from '../services/GridService';
import { GameOverConditionService } from '../services/GameOverConditionService';
import { GameService } from '../services/GameService';
const { ccclass, property } = cc._decorator;

@ccclass('GameControllerComponent')
export class GameControllerComponent extends cc.Component {
    @property({type: GridControllerComponent})
    gridController: GridControllerComponent;

    @property({type: cc.Node})
    gameOverPanel: cc.Node;

    game: GameModel = new GameModel();
    _viewMap: Map<TileModel, Node> = new Map<TileModel, Node>();

    private _gameService: GameService;
    private _gridService: GridService;
    private _gameOverConditionService: GameOverConditionService;

    protected onEnable(): void {
        this.init();
    }

    init() {
        this.initServices();
        this.initComponents();

        this.gridController.eventTarget.on('endOfTurn', this.onEndOfTurn, this);
    }

    onEndOfTurn() {
        this.game.currentTurn++;
        if (this._gameOverConditionService.check(this.gridController.grid)) {
            this.gameOver();
        }
    }

    initServices() {
        this._gridService = new GridService();
        this._gameOverConditionService = new GameOverConditionService(this._gridService);
        this._gameService = new GameService(this._gameOverConditionService);
    }

    initComponents() {
        this.gridController.init(this._gridService);
    }

    start() {
        this.startGame();
    }

    startGame () {
        this._gameService.startGame(this.game);
        this.gridController.createGrid(4, 6);
    }

    gameOver () {
        this._gameService.gameOver(this.game);
        this.gameOverPanel.active = true;
    }

    newGame() {
        if (this.game !== undefined) {
            this.destroyGame();
        }

        this.start();
        this.gameOverPanel.active = false;
    }

    destroyGame() {
        this.gridController.clearGrid();
    }
}