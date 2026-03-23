import { GameModel } from '../models/GameModel';
import { GameState } from '../common/enums/GameState';
import { TileModel } from '../models/TileModel';
import { GridControllerComponent } from './GridControllerComponent';
import { GridService } from '../services/GridService';
import { GameOverConditionService } from '../services/GameOverConditionService';
const { ccclass, property } = cc._decorator;

@ccclass('GameControllerComponent')
export class GameControllerComponent extends cc.Component {
    @property({type: GridControllerComponent})
    gridController: GridControllerComponent;

    @property({type: cc.Node})
    gameOverPanel: cc.Node;

    game: GameModel = new GameModel();
    _viewMap: Map<TileModel, Node> = new Map<TileModel, Node>();

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
        if (this._gameOverConditionService.check()) {
            this.gameOver();
        }
    }

    initServices() {
        this._gridService = new GridService();
        this._gameOverConditionService = new GameOverConditionService(this._gridService);
    }

    initComponents() {
        this.gridController.init(this._gridService);
    }

    start() {
        this.startGame();
    }

    startGame () {
        this.game.score = 0;
        this.game.state = GameState.GS_Play;
        this.gridController.createGrid(4, 6);
    }

    gameOver () {
        this.game.state = GameState.GS_GameOver;
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