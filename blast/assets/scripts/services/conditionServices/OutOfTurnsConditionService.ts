import { GameModel } from "../../models/GameModel";

export class OutOfTurnsConditionService {
    check(game: GameModel): boolean {
        return game.remainMoves <= 0;
    }
}