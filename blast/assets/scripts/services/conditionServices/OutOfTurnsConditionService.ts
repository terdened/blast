import { GameModel } from "../../models/GameModel";

export class OutOfTurnsConditionService {
    public check(game: GameModel): boolean {
        return game.remainMoves <= 0;
    }
}