import { GameState } from "../common/enums/GameState";

export class GameModel {
    state: GameState;
    score: number;
    targetScore: number;
    remainMoves: number;

    public constructor(init?:Partial<GameModel>) {
        Object.assign(this, init);
    }
}