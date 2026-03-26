import { GameState } from "../../common/enums/GameState";

export class EndOfTurnResultModel {
    public IsGridUpdated: boolean;
    public GameState: GameState;

    public constructor(init?:Partial<EndOfTurnResultModel>) {
        Object.assign(this, init);
    }
}