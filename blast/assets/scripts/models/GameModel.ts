import { GameState } from "../common/enums/GameState";

export class GameModel {
    state: GameState;
    score: number;
    currentTurn: number;

    public constructor(init?:Partial<GameModel>) {
        Object.assign(this, init);
    }
}