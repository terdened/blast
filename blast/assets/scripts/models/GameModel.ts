import { GameState } from "../common/enums/GameState";

export class GameModel {
    public state: GameState;
    
    public score: number;
    public targetScore: number;

    public remainMoves: number;

    public remainShuffleCounts: number;

    public constructor(init?:Partial<GameModel>) {
        Object.assign(this, init);
    }
}